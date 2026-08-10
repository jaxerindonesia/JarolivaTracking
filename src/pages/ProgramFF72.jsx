import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, AlertTriangle, X, Square, Phone, Zap, CalendarDays, CheckCircle2 } from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import { useFastingTimer } from '../hooks/useFastingTimer'
import { activeSession, checkins, glucoseLogs, products, consumptionLog } from '../data/mockData'

const tabs = ['Tracker', 'Timeline', 'Gula Darah', 'Protokol']
const STORAGE_KEY = 'jaxlab-ff72-session'

const toDateTimeLocal = (date) => {
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const getSavedSession = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export default function ProgramFF72() {
  const savedSession = getSavedSession()
  const [activeTab, setActiveTab] = useState('Tracker')
  const [showStopModal, setShowStopModal] = useState(false)
  const [stopReason, setStopReason] = useState('')
  const [programStatus, setProgramStatus] = useState(savedSession?.status || 'active')
  const [sessionStart, setSessionStart] = useState(savedSession?.startTime || activeSession.start_time)
  const [stoppedAt, setStoppedAt] = useState(savedSession?.stoppedAt || null)
  const [selectedStart, setSelectedStart] = useState(toDateTimeLocal(new Date()))
  const timer = useFastingTimer(sessionStart, activeSession.target_hours, stoppedAt)
  const stopReasons = ['Sangat lapar', 'Pusing', 'Lemas', 'Mual', 'Gula darah turun', 'Keluhan lainnya']

  const stopProgram = () => {
    if (!stopReason) return
    const stoppedTime = new Date().toISOString()
    setStoppedAt(stoppedTime)
    setProgramStatus('stopped')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      status: 'stopped', startTime: sessionStart, stoppedAt: stoppedTime, stopReason
    }))
    setShowStopModal(false)
  }

  const startNewProgram = () => {
    setStopReason('')
    setActiveTab('Tracker')
    setStoppedAt(null)
    setSelectedStart(toDateTimeLocal(new Date()))
    setProgramStatus('setup')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'setup' }))
  }

  const activateProgram = () => {
    const startTime = new Date(selectedStart).toISOString()
    setSessionStart(startTime)
    setStoppedAt(null)
    setProgramStatus('active')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'active', startTime }))
  }

  if (programStatus === 'stopped') {
    return (
      <div className="program-page program-stopped-page fade-in">
        <div className="page-header">
          <h1 className="page-title">Program FF72</h1>
          <p className="page-subtitle">Fat Fasting 72 Jam JaxLab</p>
        </div>

        <section className="program-stopped-card">
          <div className="program-stopped-emoji" aria-hidden="true">💪</div>
          <h2>Program Dihentikan</h2>
          <p>Tidak apa-apa. Istirahat dulu, dan coba lagi saat tubuh sudah siap.</p>
          <p className="program-stopped-duration">
            Durasi puasa: <strong>{timer.timeString}</strong>
          </p>
        </section>

        <button className="program-restart-button" type="button" onClick={startNewProgram}>
          Mulai Program Baru
        </button>
      </div>
    )
  }

  if (programStatus === 'setup') {
    const finishTime = new Date(new Date(selectedStart).getTime() + activeSession.target_hours * 3600000)

    return (
      <div className="program-page program-setup-page fade-in">
        <div className="page-header">
          <h1 className="page-title">Program FF72</h1>
          <p className="page-subtitle">Fat Fasting 72 Jam JaxLab</p>
        </div>

        <section className="program-setup-hero">
          <Zap size={42} />
          <h2>Fat Fasting 72 Jam</h2>
          <p>Anda akan memulai perjalanan 3 hari penuh. Asisten digital JaxLab akan menemani setiap langkah Anda.</p>
        </section>

        <section className="program-setup-card">
          <h3><CalendarDays size={20} /> Pilih Waktu Mulai</h3>
          <label htmlFor="ff72-start-time">Tanggal &amp; Jam Mulai</label>
          <input
            id="ff72-start-time"
            type="datetime-local"
            value={selectedStart}
            onChange={(event) => setSelectedStart(event.target.value)}
          />
          <p className="program-finish-info">
            Program akan selesai pada: <strong>{finishTime.toLocaleString('id-ID', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}</strong>
          </p>
        </section>

        <section className="program-setup-card program-ready-card">
          <h3>Pastikan Anda Sudah Siap:</h3>
          {[
            'Sudah menyelesaikan Screening Kesehatan',
            'Air mineral tersedia minimal 2 liter/hari',
            'Produk JaxLab (Olive Oil, VCO, C8 Oil) tersedia',
            'Tidak ada aktivitas berat yang direncanakan',
          ].map((item) => <p key={item}><CheckCircle2 size={16} /> {item}</p>)}
        </section>

        <button className="program-start-button" type="button" onClick={activateProgram}>
          <Zap size={18} /> Mulai Fat Fasting Sekarang
        </button>
      </div>
    )
  }

  return (
    <div className="program-page fade-in">
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
          Mulai: {new Date(sessionStart).toLocaleDateString('id-ID', {
            day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
          })}
        </div>
      </div>

      {/* Large Timer Card */}
      <div className="program-timer-card card fade-in fade-in-delay-2" style={{ padding: '32px 24px', textAlign: 'center', marginBottom: 24 }}>
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
            onClick={() => setShowStopModal(true)}
          >
            <Square size={16} />
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

      {showStopModal && createPortal((
        <div className="stop-program-overlay" role="presentation" onMouseDown={() => setShowStopModal(false)}>
          <div
            className="stop-program-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stop-program-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="stop-modal-close" aria-label="Tutup" onClick={() => setShowStopModal(false)}>
              <X size={19} />
            </button>
            <h2 id="stop-program-title">Hentikan Program</h2>
            <p className="stop-modal-subtitle">Apa yang sedang Anda rasakan?</p>

            <div className="stop-reason-grid">
              {stopReasons.map((reason) => (
                <button
                  key={reason}
                  className={`stop-reason${stopReason === reason ? ' selected' : ''}`}
                  onClick={() => setStopReason(reason)}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="stop-safety-card">
              <strong><AlertTriangle size={15} /> Cara berhenti yang aman:</strong>
              <ol>
                <li>Minum air putih perlahan.</li>
                <li>Konsumsi 1 sendok makan madu atau jus buah encer.</li>
                <li>Duduk/berbaring dan istirahat.</li>
                <li>Jika tidak membaik, segera hubungi tenaga kesehatan.</li>
              </ol>
            </div>

            <div className="stop-modal-actions">
              <button className="stop-continue-button" onClick={() => setShowStopModal(false)}>
                Tetap Lanjutkan
              </button>
              <button
                className="stop-confirm-button"
                disabled={!stopReason}
                onClick={stopProgram}
              >
                <Phone size={16} /> Hentikan
              </button>
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  )
}
