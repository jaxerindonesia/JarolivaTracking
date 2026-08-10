import {
  Award,
  CalendarDays,
  ChevronRight,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Trophy,
  UserRound,
  Weight,
  Zap,
} from 'lucide-react'
import { screeningResult } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { api } from '../lib/api'

export default function Profil() {
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user.name, phone: user.phone || '', birthDate: user.birth_date?.slice(0, 10) || '',
    gender: user.gender || '', city: user.city || '', weightKg: user.weight_kg || '', heightCm: user.height_cm || '',
  })
  const initials = user.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const age = user.birth_date ? Math.floor((Date.now() - new Date(user.birth_date).getTime()) / 31557600000) : null
  const profileRows = [
    { label: 'Nama Lengkap', value: user.name, icon: UserRound },
    { label: 'Email', value: user.email, icon: Mail },
    { label: 'No. Telepon', value: user.phone || 'Belum diisi', icon: Phone },
    { label: 'Umur', value: age ? `${age} tahun` : 'Belum diisi', icon: CalendarDays },
    { label: 'Jenis Kelamin', value: user.gender || 'Belum diisi', icon: UserRound },
    { label: 'Kota', value: user.city || 'Belum diisi', icon: MapPin },
    { label: 'Berat Badan', value: user.weight_kg ? `${Number(user.weight_kg)} kg` : 'Belum diisi', icon: Weight },
    { label: 'Tinggi Badan', value: user.height_cm ? `${Number(user.height_cm)} cm` : 'Belum diisi', icon: Ruler },
  ]
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })
  const saveProfile = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try { const updated = await api('/me', { method: 'PUT', body: JSON.stringify(form) }); setUser(updated); setEditing(false) }
    catch (e) { setError(e.message) } finally { setSaving(false) }
  }
  return (
    <div className="profile-page fade-in">
      <div className="page-header profile-header">
        <h1 className="page-title">Profil Saya</h1>
        <p className="page-subtitle">Kelola informasi dan data kesehatan Anda</p>
      </div>

      <section className="profile-hero">
        <div className="profile-hero-orb" />
        <div className="profile-identity">
          <div className="profile-avatar">{initials}</div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span><MapPin size={13} /> {user.city || 'Profil member'}</span>
          </div>
        </div>

        <div className="profile-summary">
          <div><Trophy /><strong>0</strong><span>FF72 Selesai</span></div>
          <div><Zap /><strong>{user.points}</strong><span>Total Poin</span></div>
          <div><Award /><strong>{screeningResult.score}</strong><span>Skor Kesiapan</span></div>
        </div>
      </section>

      <section className="profile-panel">
        <div className="profile-panel-header">
          <h3>DATA DIRI</h3>
          <button type="button" onClick={() => setEditing(!editing)}><Edit3 /> {editing ? 'Batal' : 'Edit'}</button>
        </div>
        {editing ? <form className="profile-edit-form" onSubmit={saveProfile}>
          <label>Nama Lengkap<input required value={form.name} onChange={update('name')} /></label>
          <label>Email<input disabled value={user.email} /></label>
          <label>No. Telepon<input value={form.phone} onChange={update('phone')} placeholder="08xxxxxxxxxx" /></label>
          <label>Tanggal Lahir<input type="date" value={form.birthDate} onChange={update('birthDate')} /></label>
          <label>Jenis Kelamin<select value={form.gender} onChange={update('gender')}><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></select></label>
          <label>Kota<input value={form.city} onChange={update('city')} /></label>
          <label>Berat Badan (kg)<input type="number" min="20" max="400" step="0.1" value={form.weightKg} onChange={update('weightKg')} /></label>
          <label>Tinggi Badan (cm)<input type="number" min="80" max="250" step="0.1" value={form.heightCm} onChange={update('heightCm')} /></label>
          {error && <div className="profile-edit-error">{error}</div>}
          <button className="profile-save-button" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Profil'}</button>
        </form> : <div className="profile-details">
          {profileRows.map(({ label, value, icon: Icon }) => (
            <button className="profile-detail-row" type="button" key={label}>
              <span className="profile-detail-icon"><Icon /></span>
              <span className="profile-detail-copy"><small>{label}</small><strong>{value}</strong></span>
              <ChevronRight className="profile-detail-arrow" />
            </button>
          ))}
        </div>}
      </section>

      <section className="profile-panel profile-screening">
        <div className="profile-panel-header"><h3>HASIL SCREENING TERAKHIR</h3></div>
        <div className="profile-screening-content">
          <div className="screening-score"><span>{screeningResult.score}</span><small>/ 100</small></div>
          <div>
            <div className="screening-ready"><ShieldCheck /> Siap Mengikuti FF72</div>
            <p>Kondisi tubuh Anda dinilai siap untuk menjalankan program.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
