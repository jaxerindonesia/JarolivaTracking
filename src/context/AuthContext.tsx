'use client'

import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { api } from '../lib/api'

export interface User {
  id: string
  name: string
  email: string
  points: number
  phone?: string | null
  birth_date?: string | null
  gender?: string | null
  city?: string | null
  weight_kg?: number | null
  height_cm?: number | null
  created_at?: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  authenticate: (mode: 'login' | 'register', values: Record<string, string>) => Promise<void>
  logout: () => void
  setUser: Dispatch<SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!localStorage.getItem('jaxlab-token')) return setLoading(false)
    api<User>('/me').then(setUser).catch(() => localStorage.removeItem('jaxlab-token')).finally(() => setLoading(false))
  }, [])
  const authenticate = async (mode, values) => {
    const data = await api<{ token: string; user: User }>(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(values) })
    localStorage.setItem('jaxlab-token', data.token); setUser(data.user)
  }
  const logout = () => { localStorage.removeItem('jaxlab-token'); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, authenticate, logout, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider')
  return context
}
