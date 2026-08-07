import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Flame, Stethoscope, TrendingUp,
  Gift, Users, User, Zap
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/program', icon: <Flame size={18} />, label: 'Program FF72' },
  { to: '/screening', icon: <Stethoscope size={18} />, label: 'Screening' },
  { to: '/progress', icon: <TrendingUp size={18} />, label: 'Progress' },
  { to: '/reward', icon: <Gift size={18} />, label: 'Reward' },
  { to: '/komunitas', icon: <Users size={18} />, label: 'Komunitas' },
  { to: '/profil', icon: <User size={18} />, label: 'Profil' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', fontWeight: 800, letterSpacing: '0.5px' }}>J</span>
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">JAXLAB</span>
          <span className="sidebar-logo-sub">Member Area</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Tip */}
      <div className="sidebar-tip">
        <span>💡 Tip:</span> Minum 8 gelas air setiap hari selama program FF72
      </div>
    </aside>
  )
}
