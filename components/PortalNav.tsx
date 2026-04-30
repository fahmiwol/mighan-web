'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mighan.com'

const nav = [
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/dashboard/rooms', label: '🏠 My Rooms' },
  { href: '/dashboard/marketplace', label: '🛒 Marketplace' },
  { href: '/dashboard/wallet', label: '💳 Wallet' },
  { href: '/profile', label: '👤 Profil' },
]

export default function PortalNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [ixBalance, setIxBalance] = useState<number | null>(null)

  const initial = user ? (user.displayName || user.email || 'U').charAt(0).toUpperCase() : 'U'

  useEffect(() => {
    const t = localStorage.getItem('mighan_user_token')
    if (!t) return
    fetch(`${API}/api/v1/wallet/balance`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json())
      .then(d => { if (d.ok && d.balance) setIxBalance(d.balance.ixc ?? 0) })
      .catch(() => {})
  }, [])

  function fmtIx(n: number) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
    return n.toString()
  }

  return (
    <nav style={{
      background: '#0f0f14',
      borderBottom: '1px solid #2a2a3a',
      padding: '0 24px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Left: Logo + Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28,
            display: 'grid', gridTemplate: '1fr 1fr / 1fr 1fr', gap: 3,
          }}>
            <span style={{ borderRadius: 4, background: '#4f6af6' }} />
            <span style={{ borderRadius: 4, background: '#22c55e' }} />
            <span style={{ borderRadius: 4, background: '#f59e0b' }} />
            <span style={{ borderRadius: 4, background: '#ec4899' }} />
          </div>
          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 18, color: '#e8eaf0' }}>
            Mighantect
          </span>
        </Link>

        <div style={{ width: 1, height: 24, background: '#2a2a3a', margin: '0 4px' }} />

        {nav.map(n => (
          <Link
            key={n.href}
            href={n.href}
            style={{
              padding: '6px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              color: pathname?.startsWith(n.href) && (n.href !== '/dashboard' || pathname === '/dashboard') ? '#e8eaf0' : '#8b8fa3',
              background: pathname?.startsWith(n.href) && (n.href !== '/dashboard' || pathname === '/dashboard') ? '#1a1a24' : 'transparent',
              border: pathname?.startsWith(n.href) && (n.href !== '/dashboard' || pathname === '/dashboard') ? '1px solid #2a2a3a' : '1px solid transparent',
              transition: 'all .15s',
            }}
          >
            {n.label}
          </Link>
        ))}
      </div>

      {/* Right: IX Balance + User + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* IX Balance pill */}
        {ixBalance !== null && (
          <Link href="/dashboard/wallet" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 20,
              background: '#1a1a28', border: '1px solid #c8b6ff33',
              cursor: 'pointer', transition: 'border-color .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#c8b6ff88')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#c8b6ff33')}
            >
              <span style={{ fontSize: 13, color: '#c8b6ff' }}>◈</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#c8b6ff' }}>{fmtIx(ixBalance)}</span>
              <span style={{ fontSize: 11, color: '#8b8fa3' }}>IX</span>
            </div>
          </Link>
        )}

        <a
          href="https://ops.mighan.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            color: '#c8b6ff',
            background: 'transparent',
            border: '1px solid #2a2a3a',
            textDecoration: 'none',
          }}
        >
          🎮 3D World
        </a>

        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f6af6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
          }}>
            {initial}
          </div>
        </Link>

        <button
          onClick={logout}
          style={{
            padding: '6px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            color: '#8b8fa3',
            background: 'transparent',
            border: '1px solid #2a2a3a',
            cursor: 'pointer',
          }}
        >
          Keluar
        </button>
      </div>
    </nav>
  )
}
