import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Layout from './components/Layout'
import Dashboard from './screens/Dashboard'
import ProgramFF72 from './screens/ProgramFF72'
import Screening from './screens/Screening'
import Progress from './screens/Progress'
import Reward from './screens/Reward'
import Komunitas from './screens/Komunitas'
import Profil from './screens/Profil'
import Login from './screens/Login'
import { useAuth } from './context/AuthContext'

const pages: Record<string, ReactNode> = {
  '/dashboard': <Dashboard />,
  '/program': <ProgramFF72 />,
  '/screening': <Screening />,
  '/progress': <Progress />,
  '/reward': <Reward />,
  '/komunitas': <Komunitas />,
  '/profil': <Profil />,
}

function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])
  if (loading) return <div className="auth-loading">Memuat...</div>
  return user ? <Layout>{children}</Layout> : null
}

export default function App() {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (pathname === '/') router.replace('/dashboard')
    else if (pathname !== '/login' && !pages[pathname]) router.replace('/dashboard')
  }, [pathname, router])

  if (pathname === '/login') return <Login />
  return <ProtectedLayout>{pages[pathname] || null}</ProtectedLayout>
}
