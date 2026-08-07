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

const profile = {
  name: 'Jax Lab',
  email: 'jaxlabofficial@gmail.com',
  phone: '08123456789',
  age: '24 tahun',
  gender: 'Perempuan',
  city: 'Bekasi',
  weight: '48 kg',
  height: '160 cm',
}

const profileRows = [
  { label: 'Nama Lengkap', value: profile.name, icon: UserRound },
  { label: 'Email', value: profile.email, icon: Mail },
  { label: 'No. Telepon', value: profile.phone, icon: Phone },
  { label: 'Umur', value: profile.age, icon: CalendarDays },
  { label: 'Jenis Kelamin', value: profile.gender, icon: UserRound },
  { label: 'Kota', value: profile.city, icon: MapPin },
  { label: 'Berat Badan', value: profile.weight, icon: Weight },
  { label: 'Tinggi Badan', value: profile.height, icon: Ruler },
]

export default function Profil() {
  return (
    <div className="profile-page fade-in">
      <div className="page-header profile-header">
        <h1 className="page-title">Profil Saya</h1>
        <p className="page-subtitle">Kelola informasi dan data kesehatan Anda</p>
      </div>

      <section className="profile-hero">
        <div className="profile-hero-orb" />
        <div className="profile-identity">
          <div className="profile-avatar">JL</div>
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <span><MapPin size={13} /> {profile.city}</span>
          </div>
        </div>

        <div className="profile-summary">
          <div><Trophy /><strong>0</strong><span>FF72 Selesai</span></div>
          <div><Zap /><strong>50</strong><span>Total Poin</span></div>
          <div><Award /><strong>{screeningResult.score}</strong><span>Skor Kesiapan</span></div>
        </div>
      </section>

      <section className="profile-panel">
        <div className="profile-panel-header">
          <h3>DATA DIRI</h3>
          <button type="button"><Edit3 /> Edit</button>
        </div>
        <div className="profile-details">
          {profileRows.map(({ label, value, icon: Icon }) => (
            <button className="profile-detail-row" type="button" key={label}>
              <span className="profile-detail-icon"><Icon /></span>
              <span className="profile-detail-copy"><small>{label}</small><strong>{value}</strong></span>
              <ChevronRight className="profile-detail-arrow" />
            </button>
          ))}
        </div>
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
