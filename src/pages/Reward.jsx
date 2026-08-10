import { CheckCircle2, Lock, Medal, Star, Trophy, Zap } from 'lucide-react'
import { rewardData, badges } from '../data/mockData'

const pointWays = [['🩺', 'Screening Kesehatan', 'Selesaikan 1x', '+50 poin'], ['⏰', 'Milestone 24 Jam', 'Per sesi aktif', '+100 poin'], ['🔥', 'Milestone 48 Jam', 'Per sesi aktif', '+150 poin'], ['🏆', 'Selesaikan FF72', 'Per sesi selesai', '+500 poin']]
const tiers = [['🌱', 'Starter', '0 – 499 poin'], ['🥉', 'Bronze', '500 – 999 poin'], ['🥈', 'Silver', '1,000 – 2,999 poin'], ['🥇', 'Gold', '3,000 – 9,999 poin'], ['💎', 'Platinum', '10,000+ poin']]

export default function Reward() {
  const basePoints = rewardData.total_points
  const totalPoints = basePoints + Number(localStorage.getItem('jaxlab-reward-points') || 0)
  const currentTier = totalPoints >= 10000 ? 'Platinum' : totalPoints >= 3000 ? 'Gold' : totalPoints >= 1000 ? 'Silver' : totalPoints >= 500 ? 'Bronze' : 'Starter'
  const nextTarget = currentTier === 'Starter' ? 500 : currentTier === 'Bronze' ? 1000 : currentTier === 'Silver' ? 3000 : currentTier === 'Gold' ? 10000 : totalPoints
  const progress = currentTier === 'Platinum' ? 100 : Math.min(100, totalPoints / nextTarget * 100)

  return <div className="reward-page fade-in">
    <div className="page-header"><h1 className="page-title">Reward &amp; Poin</h1><p className="page-subtitle">Kumpulkan poin dan raih badge eksklusif</p></div>
    <section className="reward-total-card">
      <div className="reward-level-badge"><Medal size={15} /> {currentTier}</div>
      <h3>TOTAL POIN ANDA</h3><div className="reward-points-value">{totalPoints}</div>
      <div className="reward-level-range"><span>{currentTier}</span><span>{nextTarget - totalPoints > 0 ? `${nextTarget - totalPoints} poin lagi` : 'Tier tertinggi'}</span></div>
      <div className="reward-progress-bar"><div className="reward-progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className="reward-meta-row"><div><strong>{rewardData.ff72_selesai}</strong><span>FF72 Selesai</span></div><div><strong>{rewardData.badge_diraih}</strong><span>Badge Diraih</span></div><div><strong>{rewardData.badge_tersisa}</strong><span>Badge Tersisa</span></div></div>
    </section>

    <div className="section-header reward-badge-header"><div className="section-title"><Trophy size={17} /> Koleksi Badge</div><span>{rewardData.badge_diraih}/{badges.length} diraih</span></div>
    <div className="badge-grid">{badges.map((badge) => <article className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`} key={badge.id}>
      {badge.unlocked ? <CheckCircle2 className="badge-unlock-icon" /> : <Lock className="badge-lock-icon" />}
      <span className="badge-emoji">{badge.emoji}</span><strong className="badge-name">{badge.name}</strong><p className="badge-desc">{badge.desc}</p><span className={`badge-rarity rarity-${badge.rarity.toLowerCase()}`}>{badge.rarity}</span>
    </article>)}</div>

    <section className="reward-info-card"><h2><Star size={17} /> CARA MENDAPATKAN POIN</h2>{pointWays.map(([emoji, name, note, points]) => <div className="reward-way" key={name}><span>{emoji}</span><div><strong>{name}</strong><small>{note}</small></div><b>{points}</b></div>)}</section>
    <section className="reward-info-card"><h2><Zap size={17} /> TINGKATAN MEMBER</h2><div className="reward-tier-list">{tiers.map(([emoji, name, range]) => <div className={`reward-tier ${name === currentTier ? 'current' : ''}`} key={name}><span>{emoji}</span><div><strong>{name}</strong><small>{range}</small></div>{name === currentTier && <b>Anda</b>}</div>)}</div></section>
  </div>
}
