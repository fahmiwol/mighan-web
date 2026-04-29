'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'

const nav = [
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/profile', label: '👤 Profil' },
]

export default function PortalNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const initial = user ? (user.displayName || user.email || 'U').charAt(0).toUpperCase() : 'U'
  const name = user?.displayName || user?.email || 'User'

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
      {/* Left: Logo + Brand */}
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
              color: pathname === n.href ? '#e8eaf0' : '#8b8fa3',
              background: pathname === n.href ? '#1a1a24' : 'transparent',
              border: pathname === n.href ? '1px solid #2a2a3a' : '1px solid transparent',
              transition: 'all .15s',
            }}
          >
            {n.label}
          </Link>
        ))}
      </div>

      {/* Right: User + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
          🎮 Enter 3D World
        </a>

        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f6af6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
        }}>
          {initial}
        </div>

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
