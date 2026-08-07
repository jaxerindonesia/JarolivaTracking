import { Lock, CheckCircle } from 'lucide-react'
import { rewardData, badges } from '../data/mockData'

export default function Reward() {
  const { total_points, level, next_level, next_level_points,
    ff72_selesai, badge_diraih, badge_tersisa } = rewardData

  const progressPercent = Math.min(100, (total_points / next_level_points) * 100)
  const pointsLeft = next_level_points - total_points

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Reward & Poin</h1>
        <p className="page-subtitle">Kumpulkan poin dan raih badge eksklusif</p>
      </div>

      {/* Total Points Card */}
      <div className="reward-total-card fade-in fade-in-delay-1">
        <div className="reward-level-badge">
          🏅 {level}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <div className="reward-points-value">{total_points}</div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>poin</div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
          {level} (0)
        </div>

        {/* Progress to next level */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
          <span>{level} (0)</span>
          <span>{next_level} ({next_level_points})</span>
        </div>
        <div className="reward-progress-bar">
          <div className="reward-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6, marginBottom: 20 }}>
          {pointsLeft} poin lagi untuk {next_level}
        </div>

        {/* Meta Stats */}
        <div className="reward-meta-row">
          <div className="reward-meta-item">
            <div className="reward-meta-value">{ff72_selesai}</div>
            <div className="reward-meta-label">FF72 Selesai</div>
          </div>
          <div className="reward-meta-item">
            <div className="reward-meta-value">{badge_diraih}</div>
            <div className="reward-meta-label">Badge Diraih</div>
          </div>
          <div className="reward-meta-item">
            <div className="reward-meta-value">{badge_tersisa}</div>
            <div className="reward-meta-label">Badge Tersisa</div>
          </div>
        </div>
      </div>

      {/* Badge Collection */}
      <div className="fade-in fade-in-delay-2">
        <div className="section-header">
          <div className="section-title">🏅 Koleksi Badge</div>
          <div className="section-link" style={{ cursor: 'default' }}>
            {badge_diraih}/{badge_diraih + badge_tersisa} diraih
          </div>
        </div>

        <div className="badge-grid">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
            >
              {badge.unlocked
                ? <CheckCircle size={16} color="#7DC242" className="badge-unlock-icon"
                    style={{ position: 'absolute', top: 12, right: 12 }} />
                : <Lock size={14} color="#9AAAB8" style={{ position: 'absolute', top: 12, right: 12 }} />
              }
              <span className="badge-emoji">{badge.emoji}</span>
              <div className="badge-name">{badge.name}</div>
              <div className="badge-desc">{badge.desc}</div>
              <span className={`badge-rarity rarity-${badge.rarity.toLowerCase()}`}>
                {badge.rarity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
