import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogIn, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/input'
import type { FormEvent } from 'react'

type Step = 'welcome' | 'methods' | 'email'

export default function Login() {
  const { user, authenticate } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  if (user) return null

  const openEmail = (nextMode: 'login' | 'register') => {
    setMode(nextMode)
    setError('')
    setStep('email')
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await authenticate(mode, form)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login-page">
      {step === 'welcome' && (
        <section className="login-welcome" aria-labelledby="welcome-title">
          <div className="login-mark"><span>ϟ</span></div>
          <img src="/jaxlab-logo.png" alt="JAXLAB+" />
          <h1 id="welcome-title">MEMBER AREA</h1>
          <p>Masuk untuk memulai perjalanan Fat Fasting 72 Jam bersama asisten digital JaxLab.</p>
          <button className="login-primary" onClick={() => setStep('methods')}>
            <LogIn size={17} /> Sign In
          </button>
        </section>
      )}

      {step === 'methods' && (
        <section className="login-card login-method-card" aria-labelledby="method-title">
          <button className="login-back" onClick={() => setStep('welcome')} aria-label="Kembali"><ArrowLeft /></button>
          <img src="/jaxlab-logo.png" alt="JAXLAB+" />
          <h1 id="method-title">Log in or Sign up</h1>
          <p>Pilih cara untuk melanjutkan ke Member Area.</p>
          <div className="login-methods">
            <button type="button" disabled><strong className="google-mark">G</strong><span>Continue with Google</span><small>Segera</small></button>
            <button type="button" disabled><strong className="apple-mark">●</strong><span>Continue with Apple</span><small>Segera</small></button>
            <button type="button" disabled><strong className="microsoft-mark">⊞</strong><span>Continue with Microsoft</span><small>Segera</small></button>
            <button type="button" onClick={() => openEmail('login')}><Mail size={18} /><span>Continue with email</span></button>
          </div>
          <p className="login-register-copy">Belum punya akun? <button onClick={() => openEmail('register')}>Daftar dengan email</button></p>
        </section>
      )}

      {step === 'email' && (
        <section className="login-card login-email-card" aria-labelledby="email-title">
          <button className="login-back" onClick={() => { setStep('methods'); setError('') }} aria-label="Kembali"><ArrowLeft /></button>
          <img src="/jaxlab-logo.png" alt="JAXLAB+" />
          <h1 id="email-title">{mode === 'login' ? 'Masuk dengan Email' : 'Buat Akun Member'}</h1>
          <p>{mode === 'login' ? 'Selamat datang kembali di Member Area.' : 'Daftar untuk memulai perjalanan FF72 Anda.'}</p>
          <form onSubmit={submit}>
            {mode === 'register' && <label>Nama lengkap<Input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}
            <label>Email<Input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Password<Input required minLength={8} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
            {error && <div className="login-error" role="alert">{error}</div>}
            <button className="login-primary" disabled={busy}>{busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}</button>
          </form>
          <p className="login-register-copy">{mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Daftar' : 'Masuk'}</button></p>
        </section>
      )}
    </main>
  )
}
