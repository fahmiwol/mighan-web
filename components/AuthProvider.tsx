'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface User {
  id?: string
  displayName?: string
  email?: string
  subscriptionTier?: string
  avatarUrl?: string
  emailVerified?: boolean
}

interface AuthCtx {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, logout: async () => {}, refreshUser: async () => {} })

const API = process.env.NEXT_PUBLIC_API_URL ?? ''
const TOKEN_KEY = 'mighan_user_token'
// Refresh 5 minutes before 1h JWT expires
const REFRESH_INTERVAL_MS = 55 * 60 * 1000

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function fetchUser(token: string): Promise<boolean> {
    const r = await fetch(`${API}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).catch(() => null)
    if (r?.ok && r.user) {
      setUser(r.user)
      return true
    }
    return false
  }

  async function tryRefresh(): Promise<string | null> {
    const r = await fetch(`${API}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // sends mighan_refresh_token cookie
    }).then(r => r.json()).catch(() => null)
    if (r?.ok && r.accessToken) {
      localStorage.setItem(TOKEN_KEY, r.accessToken)
      return r.accessToken
    }
    return null
  }

  function scheduleRefresh() {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    refreshTimer.current = setTimeout(async () => {
      const newToken = await tryRefresh()
      if (newToken) {
        await fetchUser(newToken)
        scheduleRefresh()
      } else {
        setUser(null)
        localStorage.removeItem(TOKEN_KEY)
      }
    }, REFRESH_INTERVAL_MS)
  }

  async function refreshUser() {
    const token = getToken()
    if (!token) return
    await fetchUser(token)
  }

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }

    fetchUser(token)
      .then(ok => {
        if (ok) scheduleRefresh()
        else localStorage.removeItem(TOKEN_KEY)
      })
      .finally(() => setLoading(false))

    return () => { if (refreshTimer.current) clearTimeout(refreshTimer.current) }
  }, [])

  const logout = async () => {
    const token = getToken()
    if (token) {
      await fetch(`${API}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {})
    }
    localStorage.removeItem(TOKEN_KEY)
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    setUser(null)
    window.location.href = '/'
  }

  return <Ctx.Provider value={{ user, loading, logout, refreshUser }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
