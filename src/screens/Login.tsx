import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import type { FormEvent } from 'react'

export default function Login() {
  const { user, authenticate } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])
  if (user) return null
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError('')
    try { await authenticate(mode, form) } catch (e) { setError(e instanceof Error ? e.message : 'Terjadi kesalahan.') } finally { setBusy(false) }
  }
  return <main className="login-page"><Card className="login-card">
    <img src="/jaxlab-logo.png" alt="JAXLAB+" />
    <h1>{mode === 'login' ? 'Masuk Member Area' : 'Buat Akun Member'}</h1>
    <p>Kelola program FF72 dan pantau perkembangan Anda.</p>
    <form onSubmit={submit}>
      {mode === 'register' && <Label>Nama<Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Label>}
      <Label>Email<Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Label>
      <Label>Password<Input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Label>
      {error && <div className="login-error">{error}</div>}
      <Button disabled={busy}>{busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}</Button>
    </form>
    <Button variant="ghost" className="login-switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}</Button>
  </Card></main>
}
