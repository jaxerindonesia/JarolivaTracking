import { useNavigate } from 'react-router-dom'
import {
  Bell, Zap, ChevronRight, Activity, Heart, Package,
  PlayCircle, Users, Flame, Star, Droplets
} from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import { useFastingTimer } from '../hooks/useFastingTimer'
import { useConsumptionSchedule } from '../hooks/useConsumptionSchedule'
import {
  currentUser, activeSession, userStats,
  products, consumptionLog
} from '../data/mockData'

export default function Dashboard() {
  const navigate = useNavigate()
  const timer = useFastingTimer(activeSession.start_time, activeSession.target_hours)
  const isConsumptionDue = useConsumptionSchedule()

  return (
    <div className="fade-in">
      {/* Top Bar */}
      <div className="top-bar">
        <div>
          <p className="page-greeting">Selamat datang kembali 👋</p>
          <h1 className="page-title">Hi, {currentUser.name}!</h1>
          <p className="page-subtitle">
            Program sedang berjalan. Tetap semangat! 🔥
          </p>
        </div>
        <div className="top-bar-actions">
          <button className="icon-btn" aria-label="Notifikasi">
            <Bell size={18} />
          </button>
          <button className="icon-btn" aria-label="Poin"
            onClick={() => navigate('/reward')}
            style={{ background: 'var(--color-navy)', border: 'none', color: 'white' }}>
            <Zap size={18} />
          </button>
        </div>
      </div>

      {/* Fasting Hero Card */}
      <div className="fasting-hero fade-in fade-in-delay-1">
        <div className="fasting-hero-header">
          <div className="fasting-status-badge">
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
            background: '#71cf00', display: 'inline-block'
            }} />
            SEDANG BERJALAN
          </div>
          <div className="fasting-day-badge">Day {activeSession.day} of 3</div>
        </div>

        <div className="fasting-hero-body">
          {/* Circular Timer */}
          <div className="circular-timer-wrapper">
            <CircularProgress
              size={110}
              strokeWidth={9}
              percentage={timer.percentage}
              color="#71cf00"
              trackColor="rgba(255,255,255,0.16)"
            >
              <div className="timer-label">Fasting Time</div>
              <div className="timer-time">{timer.timeString}</div>
              <div className="timer-target">/{activeSession.target_hours}:00:00</div>
            </CircularProgress>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h2 className="fasting-hero-title">FF72 Challenge</h2>
            <p className="fasting-hero-desc">
              Anda sedang berjalan {timer.hours}j {timer.minutes}m. Jaga konsumsi lemak sehat!
            </p>
            <button
              className="btn-program"
              onClick={() => navigate('/program')}
            >
              <Zap size={15} /> Lihat Program Aktif 🔥
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-icon">🔬</span>
            <span className="stat-value">{userStats.ketone}</span>
            <span className="stat-label">Ketone</span>
            <span className="stat-unit">mmol/L</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🩸</span>
            <span className="stat-value">{userStats.glucose}</span>
            <span className="stat-label">Glucose</span>
            <span className="stat-unit">mg/dL</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚖️</span>
            <span className="stat-value">{userStats.weight}</span>
            <span className="stat-label">Weight</span>
            <span className="stat-unit">kg</span>
          </div>
        </div>
      </div>

      {/* Today's Mission */}
      <div className="mission-card fade-in fade-in-delay-2">
        <div className="mission-header">
          <div className="mission-title">
            <span className="mission-title-icon"><Droplets size={17} /></span>
            <span>
              TODAY'S MISSION
              <small>Minum {userStats.water_goal} gelas air hari ini</small>
            </span>
          </div>
          <span className="mission-count">
            {userStats.water_glasses} / {userStats.water_goal}
          </span>
        </div>
        <div className="water-pills">
          {Array.from({ length: userStats.water_goal }).map((_, i) => (
            <div
              key={i}
              className={`water-pill${i < userStats.water_glasses ? ' filled' : ''}`}
              title={`Gelas ke-${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Produk Protokol */}
      <div className="product-protocol-panel fade-in fade-in-delay-3">
        <div className="section-header">
          <div className="section-title product-protocol-title">
            <Package size={15} />
            Produk Protokol FF72
          </div>
          <button className="section-link" onClick={() => navigate('/program')}>
            Lihat jadwal <ChevronRight size={14} />
          </button>
        </div>
        <div className="product-scroll">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-img-wrapper">
                <img
                  src={p.img}
                  alt={p.name}
                  className="product-img"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="product-img-placeholder" style={{ display: 'none', fontSize: 28 }}>
                  🧴
                </div>
              </div>
              <div className="product-name">{p.name}</div>
              <div className="product-qty-badge">{p.qty}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pengingat Konsumsi */}
      <div className="fade-in fade-in-delay-4" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div className="section-title">
            🔔 Pengingat Konsumsi Hari Ini
          </div>
          <button className="section-link" onClick={() => navigate('/program')}>
            Detail <ChevronRight size={14} />
          </button>
        </div>
        <div className="card consumption-list-card">
          {consumptionLog.map((item) => {
            const isDue = isConsumptionDue(item.time)
            return <div key={item.id} className={`consumption-item${isDue ? ' consumption-item-due' : ''}`}>
              <div className="consumption-time-block">
                <span className="consumption-time-text">{item.time}</span>
                {isDue && (
                  <span className="consumption-done-dot" title="Sudah dikonsumsi">✓</span>
                )}
              </div>
              <div
                className="consumption-icon"
                style={{ background: `${item.color}18`, fontSize: 18 }}
              >
                {item.emoji}
              </div>
              <div className="consumption-text" style={{ flex: 1 }}>
                <h4>{item.meal} — {item.items}</h4>
                <p>{item.detail}</p>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            </div>
          })}
        </div>
      </div>

      {/* Aksi Cepat */}
      <div className="quick-actions-section fade-in fade-in-delay-4">
        <div className="section-title quick-actions-title">
          Aksi Cepat
        </div>
        <div className="quick-actions-grid">
          <button
            className="quick-action-btn"
            onClick={() => navigate('/progress')}
          >
            <div className="quick-action-icon" style={{ background: 'rgba(232, 64, 64, 0.1)' }}>
              <Heart size={20} style={{ color: '#E84040' }} />
            </div>
            <span className="quick-action-copy"><strong>Log Kesehatan</strong></span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => navigate('/program')}
          >
            <div className="quick-action-icon" style={{ background: 'rgba(74, 144, 217, 0.1)' }}>
              <Activity size={20} style={{ color: '#4A90D9' }} />
            </div>
            <span className="quick-action-copy"><strong>Panduan Produk</strong></span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => navigate('/program')}
          >
            <div className="quick-action-icon quick-action-icon-green">
              <PlayCircle size={21} />
            </div>
            <span className="quick-action-copy"><strong>Video Edukasi</strong></span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => navigate('/komunitas')}
          >
            <div className="quick-action-icon quick-action-icon-purple">
              <Users size={21} />
            </div>
            <span className="quick-action-copy"><strong>Komunitas</strong></span>
          </button>
          <button className="quick-action-btn quick-action-stat" onClick={() => navigate('/progress')}>
            <div className="quick-action-icon quick-action-icon-orange">
              <Flame size={21} />
            </div>
            <span className="quick-action-copy">
              <strong>0x</strong>
              <small>FF72 Selesai</small>
            </span>
          </button>
          <button className="quick-action-btn quick-action-stat" onClick={() => navigate('/reward')}>
            <div className="quick-action-icon quick-action-icon-yellow">
              <Star size={21} />
            </div>
            <span className="quick-action-copy">
              <strong>0</strong>
              <small>Total Poin</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
