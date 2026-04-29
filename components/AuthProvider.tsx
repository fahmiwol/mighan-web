'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  displayName?: string
  name?: string
  email?: string
  tier?: string
  subscriptionTier?: string
  avatarUrl?: string
}

interface AuthCtx {
  user: User | null
  loading: boolean
  logout: () => void
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, logout: () => {} })

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mighan_user_token')
    if (!token) { setLoading(false); return }

    fetch(`${API}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => { if (j.ok && j.user) { setUser(j.user) } else { localStorage.removeItem('mighan_user_token') } })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem('mighan_user_token')
    setUser(null)
    window.location.href = '/'
  }

  return <Ctx.Provider value={{ user, loading, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
