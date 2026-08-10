import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { readFile } from 'node:fs/promises'
import { pool, query } from './db.js'
import { createToken, requireAuth } from './auth.js'

dotenv.config()
const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', async (_req, res) => {
  try { await query('SELECT 1'); res.json({ ok: true }) }
  catch { res.status(503).json({ ok: false, message: 'Database belum terhubung.' }) }
})

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name?.trim() || !email?.trim() || password?.length < 8) return res.status(400).json({ message: 'Nama, email, dan password minimal 8 karakter wajib diisi.' })
  try {
    const hash = await bcrypt.hash(password, 12)
    const { rows } = await query('INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,points', [name.trim(), email.trim().toLowerCase(), hash])
    res.status(201).json({ token: createToken(rows[0]), user: rows[0] })
  } catch (error) {
    res.status(error.code === '23505' ? 409 : 500).json({ message: error.code === '23505' ? 'Email sudah digunakan.' : 'Gagal membuat akun.' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { rows } = await query('SELECT * FROM users WHERE email=$1', [req.body.email?.trim().toLowerCase()])
  const user = rows[0]
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password_hash))) return res.status(401).json({ message: 'Email atau password salah.' })
  res.json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email, points: user.points } })
})

app.get('/api/me', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT id,name,email,points,phone,birth_date,gender,city,weight_kg,height_cm,created_at FROM users WHERE id=$1', [req.user.id])
  res.json(rows[0])
})

app.put('/api/me', requireAuth, async (req, res) => {
  const b = req.body
  if (!b.name?.trim()) return res.status(400).json({ message: 'Nama wajib diisi.' })
  const weight = b.weightKg === '' ? null : Number(b.weightKg)
  const height = b.heightCm === '' ? null : Number(b.heightCm)
  if ((weight && (weight < 20 || weight > 400)) || (height && (height < 80 || height > 250))) return res.status(400).json({ message: 'Berat atau tinggi tidak valid.' })
  const { rows } = await query(`UPDATE users SET name=$1,phone=$2,birth_date=$3,gender=$4,city=$5,weight_kg=$6,height_cm=$7 WHERE id=$8 RETURNING id,name,email,points,phone,birth_date,gender,city,weight_kg,height_cm,created_at`, [
    b.name.trim(), b.phone?.trim() || null, b.birthDate || null, b.gender || null, b.city?.trim() || null, weight, height, req.user.id,
  ])
  res.json(rows[0])
})

app.get('/api/program', requireAuth, async (req, res) => {
  const [sessions, checkins, glucose] = await Promise.all([
    query("SELECT * FROM fasting_sessions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1", [req.user.id]),
    query('SELECT * FROM checkins WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]),
    query('SELECT * FROM glucose_logs WHERE user_id=$1 ORDER BY logged_at ASC', [req.user.id]),
  ])
  res.json({ session: sessions.rows[0] || null, checkins: checkins.rows, glucose: glucose.rows })
})

app.post('/api/program/start', requireAuth, async (req, res) => {
  try {
    const { rows } = await query("INSERT INTO fasting_sessions(user_id,start_time,status) VALUES($1,$2,'active') RETURNING *", [req.user.id, req.body.startTime])
    res.status(201).json(rows[0])
  } catch (error) { res.status(error.code === '23505' ? 409 : 500).json({ message: error.code === '23505' ? 'Masih ada program aktif.' : 'Gagal memulai program.' }) }
})

app.post('/api/program/stop', requireAuth, async (req, res) => {
  const { rows } = await query("UPDATE fasting_sessions SET status='stopped',end_time=NOW(),stop_reason=$2 WHERE id=$1 AND user_id=$3 AND status='active' RETURNING *", [req.body.sessionId, req.body.reason, req.user.id])
  res.json(rows[0])
})

app.post('/api/checkins', requireAuth, async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const b = req.body
    const { rows } = await client.query('INSERT INTO checkins(user_id,session_id,condition,emoji,water_glasses,jaroliva_taken,followed_protocol) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *', [req.user.id,b.sessionId || null,b.condition,b.emoji,b.waterGlasses,b.jarolivaTaken,b.followedProtocol])
    await client.query('UPDATE users SET points=points+10 WHERE id=$1', [req.user.id])
    await client.query('COMMIT')
    res.status(201).json(rows[0])
  } catch { await client.query('ROLLBACK'); res.status(400).json({ message: 'Check-in gagal disimpan.' }) }
  finally { client.release() }
})

app.post('/api/glucose', requireAuth, async (req, res) => {
  const b = req.body
  try {
    const { rows } = await query('INSERT INTO glucose_logs(user_id,session_id,phase,value) VALUES($1,$2,$3,$4) RETURNING *', [req.user.id,b.sessionId || null,b.phase,b.value])
    res.status(201).json(rows[0])
  } catch { res.status(400).json({ message: 'Nilai gula darah tidak valid.' }) }
})

app.use('/api', (_req, res) => res.status(404).json({ message: 'Endpoint API tidak ditemukan. Restart backend jika kode baru saja diperbarui.' }))

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Server gagal memproses permintaan.' })
})

if (process.argv.includes('--migrate')) {
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
  await pool.query(schema); console.log('Database siap.'); await pool.end()
} else {
  app.listen(process.env.PORT || 3001, () => console.log(`API berjalan di port ${process.env.PORT || 3001}`))
}
