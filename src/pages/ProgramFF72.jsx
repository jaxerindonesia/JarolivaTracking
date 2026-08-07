import { useState } from 'react'
import { ChevronRight, AlertTriangle } from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import { useFastingTimer } from '../hooks/useFastingTimer'
import { activeSession, checkins, glucoseLogs, products, consumptionLog } from '../data/mockData'

const tabs = ['Tracker', 'Timeline', 'Gula Darah', 'Protokol']

export default function ProgramFF72() {
  const [activeTab, setActiveTab] = useState('Tracker')
  const timer = useFastingTimer(activeSession.start_time, activeSession.target_hours)

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Program FF72</h1>
        <p className="page-subtitle">Program sedang berjalan 🔥</p>
      </div>

      {/* Status Banner */}
      <div className="status-banner fade-in fade-in-delay-1">
        <div className="status-banner-left">
          <div className="status-dot" />
          Program Aktif
        </div>
        <div className="status-banner-right">
          Mulai: {new Date(activeSession.start_time).toLocaleDateString('id-ID', {
            day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
          })}
        </div>
      </div>

      {/* Large Timer Card */}
      <div className="card fade-in fade-in-delay-2" style={{ padding: '32px 24px', textAlign: 'center', marginBottom: 24 }}>
        <CircularProgress
          size={200}
          strokeWidth={14}
          percentage={timer.percentage}
          color="#7DC242"
          trackColor="#F0F3F8"
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 32, fontWeight: 700, color: 'var(--color-text-primary)',
              letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              fontFamily: 'Inter, sans-serif'
            }}>
              {timer.timeString}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              / {activeSession.target_hours}:00:00
            </div>
            <div style={{
              fontSize: 14, fontWeight: 600, color: 'var(--color-green-dark)', marginTop: 6
            }}>
              {timer.percentage.toFixed(0)}% selesai
            </div>
          </div>
        </CircularProgress>
      </div>

      {/* Tabs */}
      <div className="tabs fade-in fade-in-delay-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Tracker' && (
        <div className="fade-in">
          {/* Stats Row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 12, marginBottom: 16
          }}>
            {[
              { icon: '✅', label: 'Check-in', value: checkins.length },
              { icon: '💧', label: 'Gelas Air', value: 8 },
              { icon: '❤️', label: 'Jaroliva', value: '✓' },
            ].map((s) => (
              <div key={s.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                <div style={{
                  fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)',
                  fontFamily: 'Playfair Display, serif'
                }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Last Condition */}
          <div style={{ marginBottom: 10 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '1px', color: 'var(--color-text-secondary)', marginBottom: 8
            }}>Kondisi terakhir</p>
            {checkins.map((c) => (
              <div key={c.id} className="condition-card">
                <span className="condition-emoji">{c.emoji}</span>
                <div className="condition-text">
                  <strong>{c.condition}</strong>
                  <span>{new Date(c.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit', month: '2-digit', year: '2-digit'
                  })}, {new Date(c.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit', minute: '2-digit'
                  })}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Accordion items */}
          <div className="accordion-item">
            <div className="accordion-left">
              <div className="accordion-icon">📊</div>
              <div className="accordion-text">
                <h4>Bagaimana kondisi Anda?</h4>
                <p>Isi check-in sekarang</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </div>

          <div className="accordion-item">
            <div className="accordion-left">
              <div className="accordion-icon">🩸</div>
              <div className="accordion-text">
                <h4>Catat Gula Darah</h4>
                <p>{glucoseLogs.length} catatan tersimpan</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </div>

          {/* Stop Button */}
          <button
            className="btn btn-danger btn-full"
            style={{ marginTop: 16 }}
          >
            <AlertTriangle size={16} />
            Saya Ingin Menghentikan Puasa
          </button>
        </div>
      )}

      {activeTab === 'Timeline' && (
        <div className="fade-in">
          <div className="card" style={{ padding: '0 20px' }}>
            {consumptionLog.map((item) => (
              <div key={item.id} className="consumption-item">
                <div className="consumption-time">
                  <span style={{ fontSize: 14 }}>🕐</span>
                  {item.time}
                </div>
                <div className="consumption-icon">{item.emoji}</div>
                <div className="consumption-text">
                  <h4>{item.meal} — {item.items}</h4>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Gula Darah' && (
        <div className="fade-in">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {glucoseLogs.map((log, idx) => (
              <div key={log.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                borderBottom: idx < glucoseLogs.length - 1 ? '1px solid var(--color-border-light)' : 'none'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(74,144,217,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18
                }}>🩸</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {log.value} {log.unit}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    {new Date(log.logged_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: log.value < 80 ? 'rgba(125,194,66,0.1)' : 'rgba(74,144,217,0.1)',
                  color: log.value < 80 ? 'var(--color-green-dark)' : '#2B72BE'
                }}>
                  {log.value < 80 ? 'Normal' : 'Baik'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Protokol' && (
        <div className="fade-in">
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            Produk yang wajib dikonsumsi selama program FF72:
          </p>
          {products.map((p) => (
            <div key={p.id} style={{
              background: 'white', border: '1px solid var(--color-border)',
              borderRadius: 12, padding: '14px 20px', marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: 'var(--color-bg)', fontSize: 26,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {p.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  Dosis: {p.qty}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
