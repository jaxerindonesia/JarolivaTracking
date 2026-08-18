import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, AlertTriangle, X, Square, Phone, Zap, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import { useFastingTimer } from '../hooks/useFastingTimer'
import { activeSession, products } from '../data/mockData'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../lib/api'
import { useRouter } from 'next/navigation'

const tabs = ['Tracker', 'Timeline', 'Gula Darah', 'Protokol']
const STORAGE_KEY = 'jaxlab-ff72-session'
const CHECKINS_KEY = 'jaxlab-ff72-checkins'
const GLUCOSE_KEY = 'jaxlab-ff72-glucose'
const KETONE_KEY = 'jaxlab-ff72-ketones'
const POINTS_KEY = 'jaxlab-reward-points'

const toDateTimeLocal = (date) => {
  const offset = date.getTimezoneOffset() * 60000
  // Keep seconds. A datetime-local value truncated to minutes is interpreted
  // as :00, which made a newly started program appear up to 59 seconds old.
  return new Date(date.getTime() - offset).toISOString().slice(0, 19)
}

const getSavedSession = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

const getSavedList = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
}

export default function ProgramFF72() {
  const router = useRouter()
  const savedSession = getSavedSession()
  const [activeTab, setActiveTab] = useState('Tracker')
  const [showStopModal, setShowStopModal] = useState(false)
  const [stopReason, setStopReason] = useState('')
  const [programStatus, setProgramStatus] = useState(savedSession?.status || 'active')
  const [sessionStart, setSessionStart] = useState(savedSession?.startTime || activeSession.start_time)
  const [stoppedAt, setStoppedAt] = useState(savedSession?.stoppedAt || null)
  const [selectedStart, setSelectedStart] = useState(toDateTimeLocal(new Date()))
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const [showGlucoseModal, setShowGlucoseModal] = useState(false)
  const [showKetoneModal, setShowKetoneModal] = useState(false)
  const [condition, setCondition] = useState('')
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [jarolivaTaken, setJarolivaTaken] = useState('')
  const [followedProtocol, setFollowedProtocol] = useState('')
  const [savedCheckins, setSavedCheckins] = useState(() => getSavedList(CHECKINS_KEY))
  const [savedGlucose, setSavedGlucose] = useState(() => getSavedList(GLUCOSE_KEY))
  const [savedKetones, setSavedKetones] = useState(() => getSavedList(KETONE_KEY))
  const [glucosePhase, setGlucosePhase] = useState('Sebelum Mulai')
  const [glucoseValue, setGlucoseValue] = useState('')
  const [ketonePhase, setKetonePhase] = useState('Sebelum Mulai')
  const [ketoneValue, setKetoneValue] = useState('')
  const [pointNotice, setPointNotice] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [screeningCompleted, setScreeningCompleted] = useState(false)
  const [screeningScore, setScreeningScore] = useState<number | null>(null)
  const timer = useFastingTimer(sessionStart, activeSession.target_hours, stoppedAt)
  const stopReasons = ['Sangat lapar', 'Pusing', 'Lemas', 'Mual', 'Gula darah turun', 'Keluhan lainnya']
  const conditions = [
    { label: 'Sangat Baik', emoji: '😊' }, { label: 'Baik', emoji: '🙂' },
    { label: 'Lapar', emoji: '😋' }, { label: 'Pusing', emoji: '😣' },
    { label: 'Lemas', emoji: '😵' }, { label: 'Mual', emoji: '🤢' },
  ]
  const glucoseDefaults = { 'Sebelum Mulai': 100, 'Hari ke-2 (opsional)': 110, 'Hari ke-3': 90, 'Setelah Selesai': 70 }
  const glucoseChartData = Object.entries(glucoseDefaults).map(([phase, fallback]) => {
    const phaseLogs = savedGlucose.filter((log) => log.phase === phase)
    return { phase, value: phaseLogs.at(-1)?.value ?? fallback }
  })

  useEffect(() => {
    api('/program').then((data) => {
      if (data.session) {
        setSessionId(data.session.id); setSessionStart(data.session.start_time)
        setStoppedAt(data.session.end_time); setProgramStatus(data.session.status)
      } else setProgramStatus('setup')
      setScreeningCompleted(Boolean(data.screeningCompleted))
      setScreeningScore(data.screeningScore)
      setSavedCheckins(data.checkins.map((item) => ({ ...item, waterGlasses: item.water_glasses, jarolivaTaken: item.jaroliva_taken ? 'Ya' : 'Tidak' })))
      setSavedGlucose(data.glucose)
      setSavedKetones(data.ketones || [])
    }).catch(() => {})
  }, [])

  const saveCheckin = async () => {
    if (!condition || !jarolivaTaken || !followedProtocol) return
    const selected = conditions.find((item) => item.label === condition)
    const saved = await api('/checkins', { method: 'POST', body: JSON.stringify({ sessionId, condition, emoji: selected.emoji, waterGlasses, jarolivaTaken: jarolivaTaken === 'Ya', followedProtocol: followedProtocol === 'Ya' }) })
    const entry = { ...saved, waterGlasses: saved.water_glasses, jarolivaTaken: saved.jaroliva_taken ? 'Ya' : 'Tidak' }
    const next = [entry, ...savedCheckins]
    setSavedCheckins(next)
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(next))
    setShowCheckinModal(false); setPointNotice(true)
    setTimeout(() => setPointNotice(false), 2600)
    setCondition(''); setWaterGlasses(0); setJarolivaTaken(''); setFollowedProtocol('')
  }

  const saveGlucose = async () => {
    const value = Number(glucoseValue)
    if (!value || value < 20 || value > 600) return
    const saved = await api('/glucose', { method: 'POST', body: JSON.stringify({ sessionId, phase: glucosePhase, value }) })
    const next = [...savedGlucose, saved]
    setSavedGlucose(next); localStorage.setItem(GLUCOSE_KEY, JSON.stringify(next))
    setGlucoseValue(''); setShowGlucoseModal(false)
  }

  const saveKetone = async () => {
    const value = Number(ketoneValue)
    if (!ketoneValue || !Number.isFinite(value) || value < 0 || value > 20) return
    const saved = await api('/ketones', { method: 'POST', body: JSON.stringify({ sessionId, phase: ketonePhase, value }) })
    const next = [...savedKetones, saved]
    setSavedKetones(next); localStorage.setItem(KETONE_KEY, JSON.stringify(next))
    setKetoneValue(''); setShowKetoneModal(false)
  }

  const stopProgram = async () => {
    if (!stopReason) return
    const saved = await api('/program/stop', { method: 'POST', body: JSON.stringify({ sessionId, reason: stopReason }) })
    const stoppedTime = saved.end_time
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

  const activateProgram = async () => {
    if (!screeningCompleted) return
    const startTime = new Date(selectedStart).toISOString()
    const saved = await api('/program/start', { method: 'POST', body: JSON.stringify({ startTime }) })
    setSessionId(saved.id)
    setSessionStart(startTime)
    setStoppedAt(null)
    setProgramStatus('active')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'active', startTime }))
  }

  if (programStatus === 'completed') {
    return (
      <div className="program-page program-stopped-page fade-in">
        <div className="page-header">
          <h1 className="page-title">Program FF72</h1>
          <p className="page-subtitle">Fat Fasting 72 Jam JaxLab</p>
        </div>

        <section className="program-stopped-card">
          <div className="program-stopped-emoji" aria-hidden="true">🎉</div>
          <h2>Program Berhasil Diselesaikan!</h2>
          <p>Selamat, Anda telah menyelesaikan Fat Fasting selama 72 jam.</p>
          <p className="program-stopped-duration">
            Durasi puasa: <strong>{timer.timeString}</strong>
          </p>
          <p><strong>+500 poin</strong> telah ditambahkan ke reward Anda.</p>
        </section>

        <button className="program-restart-button" type="button" disabled={!screeningCompleted} onClick={startNewProgram}>
          Mulai Program Baru
        </button>
      </div>
    )
  }

  if (programStatus === 'stopped') {
    return (
      <div className="program-page program-stopped-page fade-in">
        <div className="page-header">
          <h1 className="page-title">Program FF72</h1>
          <p className="page-subtitle">Fat Fasting 72 Jam JaxLab</p>
        </div>

        {!screeningCompleted && (
          <aside className="program-screening-warning" role="alert">
            <AlertTriangle size={20} />
            <div>
              <strong>{screeningScore !== null ? 'Screening belum lulus' : 'Screening diperlukan'}</strong>
              <p>{screeningScore !== null ? `Skor Anda ${screeningScore}/100. Screening ulang dapat dilakukan besok.` : 'Selesaikan screening kesehatan terlebih dahulu untuk memulai program.'}</p>
              <button type="button" onClick={() => router.push('/screening')}>Ke halaman Screening →</button>
            </div>
          </aside>
        )}

        <section className="program-stopped-card">
          <div className="program-stopped-emoji" aria-hidden="true">💪</div>
          <h2>Program Dihentikan</h2>
          <p>Tidak apa-apa. Istirahat dulu, dan coba lagi saat tubuh sudah siap.</p>
          <p className="program-stopped-duration">
            Durasi puasa: <strong>{timer.timeString}</strong>
          </p>
        </section>

        <button className="program-restart-button" type="button" disabled={!screeningCompleted} onClick={startNewProgram}>
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

        {!screeningCompleted && (
          <aside className="program-screening-warning" role="alert">
            <AlertTriangle size={20} />
            <div>
              <strong>{screeningScore !== null ? 'Screening belum lulus' : 'Screening diperlukan'}</strong>
              <p>{screeningScore !== null ? `Skor Anda ${screeningScore}/100. Screening ulang dapat dilakukan besok.` : 'Selesaikan screening kesehatan terlebih dahulu untuk memulai program.'}</p>
              <button type="button" onClick={() => router.push('/screening')}>Ke halaman Screening →</button>
            </div>
          </aside>
        )}

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
            step="1"
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

        <button className="program-start-button" type="button" disabled={!screeningCompleted} onClick={activateProgram}>
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
              { icon: '✅', label: 'Check-in', value: savedCheckins.length },
              { icon: '💧', label: 'Gelas Air', value: savedCheckins[0]?.waterGlasses ?? 0 },
              { icon: '❤️', label: 'Jaroliva', value: savedCheckins[0]?.jarolivaTaken === 'Ya' ? '✓' : '—' },
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
          {savedCheckins.length > 0 && <div className="last-condition-history">
            {savedCheckins.slice(0, 1).map((c) => (
              <div key={c.id} className="condition-card">
                <span className="condition-emoji">{c.emoji}</span>
                <div className="condition-text">
                  <span className="condition-history-label">Kondisi terakhir</span>
                  <strong>{c.condition}</strong>
                  <span className="condition-history-date">{new Date(c.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit', month: '2-digit', year: '2-digit'
                  })}, {new Date(c.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit', minute: '2-digit'
                  })}</span>
                </div>
              </div>
            ))}
          </div>}

          {/* Accordion items */}
          <button className="accordion-item program-action-item" onClick={() => setShowCheckinModal(true)}>
            <div className="accordion-left">
              <div className="accordion-icon">📊</div>
              <div className="accordion-text">
                <h4>Bagaimana kondisi Anda?</h4>
                <p>Isi check-in sekarang</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </button>

          <button className="accordion-item program-action-item" onClick={() => setShowGlucoseModal(true)}>
            <div className="accordion-left">
              <div className="accordion-icon">🩸</div>
              <div className="accordion-text">
                <h4>Catat Gula Darah</h4>
                <p>{savedGlucose.length} catatan tersimpan</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </button>

          <button className="accordion-item program-action-item" onClick={() => setShowKetoneModal(true)}>
            <div className="accordion-left">
              <div className="accordion-icon">🧪</div>
              <div className="accordion-text">
                <h4>Catat Ketone</h4>
                <p>{savedKetones.length} catatan tersimpan</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </button>

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
          <div className="card fasting-timeline">
            <h3>PERJALANAN FF72</h3>
            {[
              ['Mulai', 'Program dimulai', 0], ['Jam ke-12', 'Glikogen mulai habis', 12],
              ['Jam ke-24', 'Ketosis dimulai', 24], ['Jam ke-36', 'Fat burning intensif', 36],
              ['Jam ke-48', 'Autophagy aktif', 48], ['Jam ke-60', 'Puncak fat burning', 60],
              ['Selesai! 🎉', 'Program berhasil', 72],
            ].map(([title, detail, hour]) => (
              <div className={`fasting-milestone${timer.hours >= Number(hour) ? ' reached' : ''}`} key={String(title)}>
                <span>{timer.hours >= Number(hour) ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}</span>
                <div><strong>{title}</strong><small>{detail}</small></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Gula Darah' && (
        <div className="fade-in">
          <div className="card glucose-chart-card">
            <h3>GRAFIK GULA DARAH</h3>
            <div className="glucose-line-chart"><ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucoseChartData} margin={{ top: 6, right: 2, left: -22, bottom: 2 }}>
                <CartesianGrid stroke="#d6e1ec" strokeDasharray="3 3" />
                <XAxis dataKey="phase" tick={{ fill: '#566a80', fontSize: 9 }} tickLine={false} axisLine={{ stroke: '#aebbc9' }} interval={0} />
                <YAxis domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} tick={{ fill: '#566a80', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`${value} mg/dL`, 'Gula darah']} contentStyle={{ border: '1px solid #d1dce8', borderRadius: 10, fontSize: 11 }} />
                <Line type="monotone" dataKey="value" stroke="#62bd00" strokeWidth={2.5} dot={{ r: 5, fill: '#62bd00', strokeWidth: 0 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer></div>
          </div>
          <div className="card glucose-value-card">
            {glucoseChartData.map((item) => <div className="glucose-value-row" key={item.phase}><span>{item.phase}</span><strong>{item.value} mg/dL</strong></div>)}
          </div>
          <div className="glucose-old-values" style={{ display: 'none' }}>
            {savedGlucose.map((log, idx) => (
              <div key={log.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                borderBottom: idx < savedGlucose.length - 1 ? '1px solid var(--color-border-light)' : 'none'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(74,144,217,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18
                }}>🩸</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>{log.phase}</div>
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
          <div className="card protocol-card"><h3>PRODUK YANG DIKONSUMSI</h3><div className="protocol-grid">
            {products.map((p) => <div className="protocol-product" key={p.id}>
              <img src={p.img} alt={p.name} />
              <div><strong>{p.name}</strong><small>{p.id === 1 ? 'Extra Virgin Olive Oil' : p.id === 2 ? 'Virgin Coconut Oil' : p.id === 3 ? 'Coconut Oil Blend' : p.id === 4 ? 'Medium Chain Triglycerides' : 'Grass-fed Ghee'}</small>
                <b>{p.qty}</b><em>{p.id === 5 ? 'Alternatif C8 Oil' : '08.00 · 13.00 · 18.30'}</em>{p.id === 5 && <i>Untuk yang punya GERD</i>}</div>
            </div>)}
          </div></div>

          <section className="card protocol-schedule-card">
            <h3>JADWAL KONSUMSI</h3>
            {[
              ['08.00', 'Sahur · Saat perut kosong'],
              ['13.00', 'Siang · Saat perut kosong'],
              ['18.30', 'Sore · Saat perut kosong'],
            ].map(([time, detail], index) => <div className="protocol-schedule" key={time}>
              <p><b className={index === 1 ? 'lime' : ''}>{time}</b><span>{detail}</span></p>
              <div className="protocol-pills"><span>Jaroliva</span><span>Cocofenol</span><span>Ketone Immuno</span><span>Max C8 / Ghee</span></div>
              {index === 1 && <em>* Berat badan berlebih: lewati sesi ini</em>}
            </div>)}
            <div className="protocol-hydration"><b>08 · 14 · 22</b><span>Hidrasi wajib</span></div>
            <p className="protocol-water-note">Air putih atau teh herbal tanpa kalori. Boleh tambahkan sedikit garam (bila TD normal).</p>
          </section>

          <aside className="protocol-important">
            <strong>⚠️ Catatan Penting</strong>
            <ul>
              <li>C8 Oil bisa diganti Vanilla Ghee untuk yang punya GERD atau lambung sensitif.</li>
              <li>Vanilla Ghee bisa langsung dikonsumsi tanpa dicampur.</li>
              <li>Semakin rendah berat badan, dosis minyak bisa lebih tinggi.</li>
            </ul>
          </aside>
        </div>
      )}

      {pointNotice && <div className="point-toast">🎉 Check-in tersimpan! <strong>+10 poin</strong></div>}

      {showCheckinModal && createPortal((
        <div className="stop-program-overlay" onMouseDown={() => setShowCheckinModal(false)}>
          <div className="program-form-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="stop-modal-close" onClick={() => setShowCheckinModal(false)}><X size={19} /></button>
            <h2>Bagaimana kondisi Anda?</h2><p>Isi check-in untuk memantau perkembangan</p>
            <h4>KONDISI SAAT INI</h4><div className="condition-grid">{conditions.map((item) =>
              <button className={condition === item.label ? 'selected' : ''} key={item.label} onClick={() => setCondition(item.label)}><span>{item.emoji}</span>{item.label}</button>)}</div>
            <h4>SUDAH MINUM BERAPA GELAS?</h4><div className="water-options">{[0,1,2,3,4,5,6,7,8].map(n => <button className={waterGlasses === n ? 'selected' : ''} key={n} onClick={() => setWaterGlasses(n)}>{n}</button>)}</div>
            <div className="binary-fields"><div><h4>Konsumsi Jaroliva?</h4><div>{['Ya','Tidak'].map(v => <button className={jarolivaTaken === v ? 'selected' : ''} key={v} onClick={() => setJarolivaTaken(v)}>{v}</button>)}</div></div>
              <div><h4>Ikuti protokol?</h4><div>{['Ya','Tidak'].map(v => <button className={followedProtocol === v ? 'selected' : ''} key={v} onClick={() => setFollowedProtocol(v)}>{v}</button>)}</div></div></div>
            <button className="modal-save-button" disabled={!condition || !jarolivaTaken || !followedProtocol} onClick={saveCheckin}>Simpan Check-in</button>
          </div>
        </div>
      ), document.body)}

      {showGlucoseModal && createPortal((
        <div className="stop-program-overlay" onMouseDown={() => setShowGlucoseModal(false)}><div className="program-form-modal" onMouseDown={(e) => e.stopPropagation()}>
          <button className="stop-modal-close" onClick={() => setShowGlucoseModal(false)}><X size={19} /></button>
          <h2>Catat Gula Darah</h2><p>Masukkan nilai gula darah (mg/dL)</p><h4>FASE PENGUKURAN</h4>
          <div className="phase-grid">{['Sebelum Mulai','Hari ke-2 (opsional)','Hari ke-3','Setelah Selesai'].map(v => <button className={glucosePhase === v ? 'selected' : ''} key={v} onClick={() => setGlucosePhase(v)}>{v}</button>)}</div>
          <label className="glucose-label">Nilai gula darah (mg/dL)</label><input className="glucose-input" type="number" min="20" max="600" value={glucoseValue} onChange={(e) => setGlucoseValue(e.target.value)} placeholder="Contoh: 95" />
          <button className="modal-save-button green" disabled={!glucoseValue} onClick={saveGlucose}>Simpan</button>
        </div></div>
      ), document.body)}

      {showKetoneModal && createPortal((
        <div className="stop-program-overlay" onMouseDown={() => setShowKetoneModal(false)}><div className="program-form-modal" onMouseDown={(e) => e.stopPropagation()}>
          <button className="stop-modal-close" onClick={() => setShowKetoneModal(false)}><X size={19} /></button>
          <h2>Catat Ketone</h2><p>Masukkan nilai ketone (mmol/L)</p><h4>FASE PENGUKURAN</h4>
          <div className="phase-grid">{['Sebelum Mulai','Hari ke-2 (opsional)','Hari ke-3','Setelah Selesai'].map(v => <button className={ketonePhase === v ? 'selected' : ''} key={v} onClick={() => setKetonePhase(v)}>{v}</button>)}</div>
          <label className="glucose-label">Nilai ketone (mmol/L)</label><input className="glucose-input" type="number" min="0" max="20" step="0.1" value={ketoneValue} onChange={(e) => setKetoneValue(e.target.value)} placeholder="Contoh: 1.5" />
          <button className="modal-save-button green" disabled={!ketoneValue} onClick={saveKetone}>Simpan</button>
        </div></div>
      ), document.body)}

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
