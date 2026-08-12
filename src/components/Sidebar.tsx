import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Flame, Stethoscope, TrendingUp,
  Gift, Users, User, Zap
} from 'lucide-react'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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
  const { logout } = useAuth()
  const pathname = usePathname()
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img className="sidebar-logo-image" src="/jaxlab-logo.png" alt="JAXLAB+" />
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            href={to}
            className={`nav-item${pathname === to ? ' active' : ''}`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={logout}><LogOut size={17} /> Keluar</button>

      {/* Tip */}
      <div className="sidebar-tip">
        <span>💡 Tip:</span> Minum 8 gelas air setiap hari selama program FF72
      </div>
    </aside>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="mobile-bottom-nav" aria-label="Navigasi utama">
      {navItems.map(({ to, icon, label }) => (
        <Link
          key={to}
          href={to}
          className={`mobile-nav-item${pathname === to ? ' active' : ''}`}
          aria-current={pathname === to ? 'page' : undefined}
        >
          {icon}
          <span>{label === 'Program FF72' ? 'Program' : label}</span>
        </Link>
      ))}
    </nav>
  )
}
