import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProgramFF72 from './pages/ProgramFF72'
import Screening from './pages/Screening'
import Progress from './pages/Progress'
import Reward from './pages/Reward'
import Komunitas from './pages/Komunitas'
import Profil from './pages/Profil'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

function ProtectedLayout() {
  const { user, loading } = useAuth()
  if (loading) return <div className="auth-loading">Memuat...</div>
  return user ? <Layout /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="program" element={<ProgramFF72 />} />
          <Route path="screening" element={<Screening />} />
          <Route path="progress" element={<Progress />} />
          <Route path="reward" element={<Reward />} />
          <Route path="komunitas" element={<Komunitas />} />
          <Route path="profil" element={<Profil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
