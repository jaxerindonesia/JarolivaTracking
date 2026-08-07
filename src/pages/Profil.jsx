import { currentUser } from '../data/mockData'

export default function Profil() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Profil</h1>
        <p className="page-subtitle">Kelola informasi akun Anda</p>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ padding: 32, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-green) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: 'white', fontWeight: 700,
            fontFamily: 'Playfair Display, serif'
          }}>
            {currentUser.name[0]}
          </div>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 4 }}>
              {currentUser.name}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {currentUser.email}
            </p>
            <span className="badge badge-active" style={{ marginTop: 6 }}>Member Aktif</span>
          </div>
        </div>

        {[
          { label: 'Nama Lengkap', value: currentUser.name },
          { label: 'Email', value: currentUser.email },
          { label: 'Program', value: 'FF72 — Fat Fasting 72 Jam' },
          { label: 'Status', value: 'Aktif' },
        ].map((item) => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0',
            borderBottom: '1px solid var(--color-border-light)'
          }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {item.label}
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <button className="btn btn-outline btn-full" style={{ color: 'var(--color-danger)' }}>
        Keluar dari Akun
      </button>
    </div>
  )
}
