'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from './AuthProvider'

const navItems = [
  { href: '/#hero',      ico: '🏠', label: 'Home' },
  { href: '/#about',     ico: 'ℹ️',  label: 'About' },
  { href: '/#usecases',  ico: '💡', label: 'Use Case' },
  { href: '/#studio',    ico: '🛠️', label: 'Studio' },
  { href: '/#news',      ico: '📰', label: 'News & Update' },
  { href: '/#kontak',    ico: '✉️', label: 'Kontak' },
]

const produkItems = [
  { href: '/#platform',   label: 'Platform' },
  { href: '/#features',   label: 'Features' },
  { href: '/#skills',     label: 'Skill' },
  { href: '/#plugins',    label: 'Plugin' },
  { href: '/#coinomics',  label: 'Coinomics' },
]

export default function Sidebar() {
  const { user, loading, logout } = useAuth()
  const [produkOpen, setProdukOpen] = useState(false)

  const initial = user ? (user.displayName || user.name || user.email || 'U').charAt(0).toUpperCase() : '?'
  const displayName = user ? (user.displayName || user.name || user.email || 'User') : ''

  return (
    <aside className="sidebar" id="sidebar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-mark">
          <span className="pix pix-1" /><span className="pix pix-2" />
          <span className="pix pix-3" /><span className="pix pix-4" />
        </div>
        <div className="logo-text">Mighantect</div>
      </div>

      <Link href="/#build" className="btn-create">+ Create New World</Link>

      <nav className="side-nav">
        {navItems.slice(0, 2).map(item => (
          <Link key={item.href} href={item.href} className="side-link">
            <span className="side-ico">{item.ico}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Produk dropdown */}
        <button
          className={`side-link has-sub${produkOpen ? '' : ''}`}
          aria-expanded={produkOpen}
          onClick={() => setProdukOpen(o => !o)}
        >
          <span className="side-ico">📦</span>
          <span>Produk</span>
          <span className="chev">▾</span>
        </button>
        <div className={`sub-nav${produkOpen ? ' open' : ''}`}>
          {produkItems.map(p => (
            <Link key={p.href} href={p.href} className="sub-link">{p.label}</Link>
          ))}
        </div>

        {navItems.slice(2).map(item => (
          <Link key={item.href} href={item.href} className="side-link">
            <span className="side-ico">{item.ico}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="side-spacer" />

      {/* Auth state */}
      {!loading && !user && (
        <div className="side-guest">
          <Link href="/login" className="btn-login">Log in</Link>
          <Link href="/register" className="btn-daftar">Daftar</Link>
        </div>
      )}
      {!loading && user && (
        <div className="side-user" style={{ cursor: 'pointer' }} onClick={logout} title="Logout">
          <div className="user-avatar">{initial}</div>
          <div className="user-info">
            <div className="user-hi">Welcome,</div>
            <div className="user-name">{displayName} ▾</div>
          </div>
        </div>
      )}
    </aside>
  )
}
