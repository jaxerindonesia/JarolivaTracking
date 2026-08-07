import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProgramFF72 from './pages/ProgramFF72'
import Screening from './pages/Screening'
import Progress from './pages/Progress'
import Reward from './pages/Reward'
import Komunitas from './pages/Komunitas'
import Profil from './pages/Profil'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
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
