import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, authenticate } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try { await authenticate(mode, form) } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return <main className="login-page"><section className="login-card">
    <img src="/jaxlab-logo.png" alt="JAXLAB+" />
    <h1>{mode === 'login' ? 'Masuk Member Area' : 'Buat Akun Member'}</h1>
    <p>Kelola program FF72 dan pantau perkembangan Anda.</p>
    <form onSubmit={submit}>
      {mode === 'register' && <label>Nama<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}
      <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {error && <div className="login-error">{error}</div>}
      <button disabled={busy}>{busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}</button>
    </form>
    <button className="login-switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}</button>
  </section></main>
}
