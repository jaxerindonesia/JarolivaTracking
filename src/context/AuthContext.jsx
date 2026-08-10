import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!localStorage.getItem('jaxlab-token')) return setLoading(false)
    api('/me').then(setUser).catch(() => localStorage.removeItem('jaxlab-token')).finally(() => setLoading(false))
  }, [])
  const authenticate = async (mode, values) => {
    const data = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(values) })
    localStorage.setItem('jaxlab-token', data.token); setUser(data.user)
  }
  const logout = () => { localStorage.removeItem('jaxlab-token'); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, authenticate, logout, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
