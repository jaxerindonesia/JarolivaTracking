import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, CalendarDays, CheckCircle2, Clock3, TrendingUp, XCircle, Zap } from 'lucide-react'
import { progressData } from '../data/mockData'

export default function Progress() {
  const { sessions, chart_data } = progressData
  const addedPoints = Number(localStorage.getItem('jaxlab-reward-points') || 0)
  const stats = [
    { icon: '🏆', value: progressData.ff72_selesai, label: 'FF72 Selesai', note: 'dari 3 sesi', tone: 'green' },
    { icon: '⚡', value: progressData.total_poin + addedPoints, label: 'Total Poin', note: 'poin terkumpul', tone: 'orange' },
    { icon: '♡', value: progressData.total_checkin, label: 'Total Check-in', note: 'selama program', tone: 'pink' },
    { icon: 'Ⅱ', value: progressData.total_sesi, label: 'Total Sesi', note: 'semua waktu', tone: 'blue' },
  ]
  const pointData = [{ name: 'Screening', poin: 50 }, { name: 'FF72 #1', poin: 550 }]

  return <div className="progress-page fade-in">
    <div className="page-header"><h1 className="page-title">Progress Anda</h1><p className="page-subtitle">Pantau perkembangan program FF72</p></div>
    <div className="progress-stats-grid">{stats.map((item) => <article className="progress-stat-card" key={item.label}>
      <span className={`progress-stat-icon ${item.tone}`}>{item.icon}</span>
      <div><strong>{item.value}</strong><b>{item.label}</b><small>{item.note}</small></div>
    </article>)}</div>
    <section className="progress-screening-card">
      <span className="progress-screening-icon"><CheckCircle2 size={21} /></span>
      <div><strong>Screening Kesehatan</strong><small>Disetujui · Skor kesiapan 100/100</small></div>
      <b>+50 poin</b>
    </section>

    <section className="chart-section progress-chart-card">
      <h2 className="chart-title"><Clock3 size={17} /> DURASI PER SESI (JAM)</h2>
      <ResponsiveContainer width="100%" height={220}><BarChart data={chart_data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 4" stroke="#d8e2ed" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#53667e' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 72]} ticks={[0, 20, 40, 72]} tick={{ fontSize: 11, fill: '#53667e' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value) => [`${value} jam`]} /><Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="selesai" name="Selesai" fill="#69c400" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="void" name="Dihentikan/Aktif" fill="#e5ebf2" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart></ResponsiveContainer>
    </section>

    <section className="chart-section progress-chart-card">
      <h2 className="chart-title"><TrendingUp size={17} /> AKUMULASI POIN</h2>
      <ResponsiveContainer width="100%" height={205}><LineChart data={pointData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 4" stroke="#d8e2ed" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#53667e' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 600]} ticks={[0, 150, 300, 450, 600]} tick={{ fontSize: 10, fill: '#53667e' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value) => [`${value} poin`]} />
        <Line type="linear" dataKey="poin" stroke="#69c400" strokeWidth={2.5} dot={false} />
      </LineChart></ResponsiveContainer>
    </section>

    <section className="progress-history-card">
      <h2 className="chart-title"><CalendarDays size={17} /> RIWAYAT SESI</h2>
      {sessions.map((session) => {
        const stopped = session.status === 'stopped'; const complete = session.status === 'complete'
        return <div className="progress-session-row" key={session.id}>
          <span className={`progress-session-icon ${complete ? 'complete' : stopped ? 'stopped' : 'active'}`}>{complete ? <CheckCircle2 /> : stopped ? <XCircle /> : <Zap />}</span>
          <div className="progress-session-copy"><strong>{session.date} <em className={`progress-status ${session.status}`}>{complete ? 'Selesai' : stopped ? 'Dihentikan' : 'Aktif'}</em></strong><small>{session.duration_hours}j berjalan · {session.checkins} check-in · {session.glucose_count} gula darah</small></div>
          <b>{session.duration_hours}j</b>
        </div>
      })}
    </section>
  </div>
}
