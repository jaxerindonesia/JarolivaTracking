import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { progressData } from '../data/mockData'

export default function Progress() {
  const { ff72_selesai, total_poin, total_checkin, total_sesi, sessions, chart_data } = progressData

  const statCards = [
    { emoji: '🏆', label: 'FF72 Selesai', sub: 'dari 1 sesi', value: ff72_selesai, color: 'green' },
    { emoji: '⭐', label: 'Total Poin', sub: 'poin terkumpul', value: total_poin, color: 'orange' },
    { emoji: '❤️', label: 'Total Check-in', sub: 'selama program', value: total_checkin, color: 'red' },
    { emoji: '📊', label: 'Total Sesi', sub: 'sampai waktu', value: total_sesi, color: 'blue' },
  ]

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Progress Anda</h1>
        <p className="page-subtitle">Pantau perkembangan program FF72</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid fade-in fade-in-delay-1">
        {statCards.map((s) => (
          <div key={s.label} className="stats-card">
            <div className={`stats-card-icon ${s.color}`}>{s.emoji}</div>
            <div>
              <div className="stats-card-value">{s.value}</div>
              <div className="stats-card-label">{s.label}</div>
              <div className="stats-card-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement */}
      <div className="achievement-card fade-in fade-in-delay-2">
        <div className="achievement-left">
          <div className="achievement-icon">🩺</div>
          <div className="achievement-text">
            <strong>Screening Kesehatan</strong>
            <span>Diselesai · Skor kesiapan 80/100</span>
          </div>
        </div>
        <div className="achievement-points">+50 poin</div>
      </div>

      {/* Bar Chart */}
      <div className="chart-section fade-in fade-in-delay-3">
        <div className="chart-title">
          📈 DURASI PER SESI (JAM)
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chart_data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF2" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6B7A8D' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7A8D' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 80]}
              ticks={[0, 20, 40, 72]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8, border: '1px solid #E4EAF2',
                fontSize: 12, fontFamily: 'Inter, sans-serif'
              }}
              formatter={(value, name) => [`${value}j`, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
              formatter={(value) => value === 'selesai' ? 'Selesai' : 'Dihentikan/Void'}
            />
            <Bar dataKey="selesai" fill="#7DC242" radius={[4, 4, 0, 0]} name="selesai" />
            <Bar dataKey="void" fill="#B0BEC5" radius={[4, 4, 0, 0]} name="void" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Session History */}
      <div className="fade-in fade-in-delay-4">
        <div className="section-header">
          <div className="section-title">🗂 RIWAYAT SESI</div>
        </div>
        {sessions.map((s) => (
          <div key={s.id} className="session-card">
            <div className="session-icon">⚡</div>
            <div className="session-info">
              <div className="session-date">
                {s.date}
                <span className={`badge badge-${s.status === 'active' ? 'active' : 'navy'}`}>
                  {s.status === 'active' ? 'Aktif' : 'Selesai'}
                </span>
              </div>
              <div className="session-meta">
                {s.duration_hours}j berjalan · {s.checkins} check-in · {s.glucose_count} gula darah
              </div>
            </div>
            <div className="session-duration">{s.duration_hours}j</div>
          </div>
        ))}
      </div>
    </div>
  )
}
