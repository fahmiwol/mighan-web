'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../components/AuthProvider'
import PortalNav from '../../components/PortalNav'
import '../(auth)/portal.css'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

interface User { id?: string; displayName?: string; email?: string; tier?: string; subscriptionTier?: string }
interface Room { id: string; name: string; description?: string; theme?: string; usedNpcSlots: number; maxNpcSlots: number; usedObjectSlots: number; maxObjectSlots: number; visibility: string }
interface Balance { ixc: number }
interface Usage { totalRequests: number; monthlyLimit: number; activeKeys: number }
interface ApiKey { id: string; name: string; maskedKey: string; tier: string; requestCount: number; createdAt: string }

function fmt(n: number) { if (n >= 1e6) return (n/1e6).toFixed(1)+'M'; if (n >= 1e3) return (n/1e3).toFixed(1)+'K'; return n.toString() }
function fmtDate(iso: string) { return iso ? new Date(iso).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'}) : '-' }

const THEME_ACCENT: Record<string, string> = {
  modern: '#4f6af6', nature: '#22c55e', creative: '#ec4899',
  minimal: '#8b8fa3', futuristic: '#06b6d4', warm: '#f59e0b',
}

export default function DashboardPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [balance, setBalance] = useState<Balance | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [devOpen, setDevOpen] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [keyTier, setKeyTier] = useState('free')
  const [newKey, setNewKey] = useState('')
  const [toast, setToast] = useState('')

  function getHeaders() {
    const token = localStorage.getItem('mighan_user_token')
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  }
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const loadAll = useCallback(async () => {
    const token = localStorage.getItem('mighan_user_token')
    if (!token) { router.push('/login'); return }
    const h = { Authorization: `Bearer ${token}` }
    const [userRes, roomRes, balRes, usageRes, keyRes] = await Promise.all([
      fetch(`${API}/api/v1/auth/me`, { headers: h }).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/v1/rooms`, { headers: h }).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/v1/wallet/balance`, { headers: h }).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/v1/user/usage`, { headers: h }).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/v1/user/keys`, { headers: h }).then(r => r.json()).catch(() => null),
    ])
    if (userRes?.ok && userRes.user) setUser(userRes.user)
    else { localStorage.removeItem('mighan_user_token'); router.push('/login'); return }
    if (roomRes?.ok) setRooms(roomRes.data?.rooms || [])
    if (balRes?.ok) setBalance(balRes.balance)
    if (usageRes?.success) setUsage(usageRes.data)
    if (keyRes?.success) setKeys(keyRes.data || [])
    setLoading(false)
  }, [router])

  useEffect(() => { loadAll() }, [loadAll])

  async function createKey() {
    const r = await fetch(`${API}/api/v1/user/keys`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ name: keyName, tier: keyTier })
    }).then(r => r.json()).catch(() => null)
    if (r?.success && r.data?.key) { setNewKey(r.data.key); showToast('API key berhasil dibuat!'); loadAll() }
    else showToast(r?.error || 'Gagal membuat key')
  }

  async function revokeKey(id: string) {
    if (!confirm('Yakin ingin revoke key ini?')) return
    const r = await fetch(`${API}/api/v1/user/keys/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()).catch(() => null)
    if (r?.success || r?.ok) { showToast('Key revoked'); loadAll() }
    else showToast('Gagal revoke key')
  }

  async function createRoom() {
    const r = await fetch(`${API}/api/v1/rooms`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ name: 'My Office', description: 'Virtual office pertama saya', theme: 'modern' })
    }).then(r => r.json()).catch(() => null)
    if (r?.ok && r.data) { showToast('Room berhasil dibuat!'); router.push(`/dashboard/rooms/${r.data.id}`) }
    else showToast(r?.error || 'Gagal membuat room')
  }

  const totalNpcs = rooms.reduce((s, r) => s + r.usedNpcSlots, 0)
  const initial = user ? (user.displayName || user.email || 'U')[0].toUpperCase() : 'U'
  const tier = user?.subscriptionTier || user?.tier || 'free'
  const pct = usage && usage.monthlyLimit > 0 ? Math.min(100, (usage.totalRequests / usage.monthlyLimit) * 100) : 0

  if (loading) {
    return (
      <div style={{ background: '#0d0d1a', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'Nunito, sans-serif' }}>
        <PortalNav />
        <div style={{ maxWidth: 1000, margin: '80px auto', textAlign: 'center', color: '#8b8fa3' }}>Memuat dashboard...</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'Nunito, sans-serif' }}>
      <PortalNav />

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 20px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 4px' }}>
            Halo, {user?.displayName?.split(' ')[0] || 'Kamu'} 👋
          </h1>
          <p style={{ color: '#8b8fa3', fontSize: 14, margin: 0 }}>
            Selamat datang di Mighantect — virtual office AI-mu
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Virtual Rooms', value: rooms.length, icon: '🏠', color: '#4f6af6' },
            { label: 'AI NPC Aktif', value: totalNpcs, icon: '🤖', color: '#22c55e' },
            { label: 'IX Balance', value: fmt(balance?.ixc || 0), icon: '◈', color: '#c8b6ff' },
            { label: 'Plan', value: tier.charAt(0).toUpperCase() + tier.slice(1), icon: '⭐', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ONBOARDING — empty state */}
        {rooms.length === 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #0f1728)',
            border: '1px dashed #4f6af666',
            borderRadius: 20,
            padding: '40px 32px',
            textAlign: 'center',
            marginBottom: 28,
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏗️</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Buat Virtual Office Pertamamu</h2>
            <p style={{ color: '#8b8fa3', fontSize: 14, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.7 }}>
              Virtual office AI-mu menunggu! Buat room, hire AI NPC, dan bagikan link ke tim atau klien. Semuanya berjalan 24/7.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={createRoom} style={{
                padding: '12px 28px', background: '#4f6af6', color: '#fff', border: 'none',
                borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 15
              }}>
                🏠 Buat Room Sekarang
              </button>
              <Link href="/dashboard/marketplace" style={{
                padding: '12px 24px', background: '#1a1a28', border: '1px solid #2a2a3a',
                color: '#e8eaf0', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
                display: 'inline-flex', alignItems: 'center'
              }}>
                🛒 Lihat Marketplace
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginTop: 28 }}>
              {[
                { icon: '1️⃣', text: 'Buat Room' },
                { icon: '2️⃣', text: 'Hire AI NPC' },
                { icon: '3️⃣', text: 'Bagikan Link' },
                { icon: '4️⃣', text: 'NPC Kerja 24/7' },
              ].map(s => (
                <div key={s.text} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontSize: 12, color: '#8b8fa3', marginTop: 4 }}>{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rooms Section */}
        {rooms.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>🏠 Virtual Rooms</h2>
              <Link href="/dashboard/rooms" style={{ fontSize: 13, color: '#4f6af6', textDecoration: 'none', fontWeight: 700 }}>
                Lihat Semua →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {rooms.slice(0, 6).map(room => {
                const accent = THEME_ACCENT[room.theme || 'modern'] || '#4f6af6'
                return (
                  <Link key={room.id} href={`/dashboard/rooms/${room.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#111120', border: `1px solid ${accent}33`, borderRadius: 14, padding: 18,
                      cursor: 'pointer', transition: 'border-color .2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = accent + '88')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = accent + '33')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, color: '#e8eaf0' }}>{room.name}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: room.visibility === 'public' ? '#22c55e' : '#8b8fa3', background: room.visibility === 'public' ? '#22c55e22' : '#2a2a3a', padding: '3px 9px', borderRadius: 20 }}>
                          {room.visibility}
                        </span>
                      </div>
                      {room.description && (
                        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {room.description}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 14 }}>
                        <div style={{ fontSize: 12, color: '#8b8fa3' }}>
                          <span style={{ color: accent, fontWeight: 700 }}>{room.usedNpcSlots}</span>/{room.maxNpcSlots} NPC
                        </div>
                        <div style={{ fontSize: 12, color: '#8b8fa3' }}>
                          <span style={{ color: accent, fontWeight: 700 }}>{room.usedObjectSlots}</span>/{room.maxObjectSlots} Objects
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {/* Create new room */}
              <button onClick={createRoom} style={{
                background: 'transparent', border: '1px dashed #2a2a3a', borderRadius: 14, padding: 18,
                cursor: 'pointer', color: '#8b8fa3', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 100,
                transition: 'border-color .2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#4f6af6')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a3a')}
              >
                <span style={{ fontSize: 24 }}>+</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Buat Room Baru</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { href: '/dashboard/rooms', icon: '🏠', label: 'My Rooms', desc: 'Kelola semua room-mu', external: false },
            { href: '/dashboard/marketplace', icon: '🛒', label: 'Marketplace', desc: 'Hire NPC, beli objects', external: false },
            { href: '/dashboard/wallet', icon: '💳', label: 'Wallet & Plans', desc: 'Top-up IX, upgrade plan', external: false },
            { href: 'https://ops.mighan.com', icon: '🎮', label: '3D World', desc: 'Enter kantor virtual', external: true },
          ].map(l => (
            <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}
              style={{ padding: '16px 18px', background: '#111120', border: '1px solid #1e1e2e', borderRadius: 12, textDecoration: 'none', color: '#e8eaf0', display: 'block', transition: 'border-color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#4f6af6')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e2e')}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{l.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{l.label}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{l.desc}</div>
            </a>
          ))}
        </div>

        {/* Developer Section — collapsible */}
        <div style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 16, overflow: 'hidden' }}>
          <button onClick={() => setDevOpen(!devOpen)} style={{
            width: '100%', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit', color: '#e8eaf0',
          }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>🔑 Developer — API Keys</span>
            <span style={{ color: '#8b8fa3', fontSize: 13 }}>{devOpen ? '▲ Tutup' : '▼ Buka'}</span>
          </button>

          {devOpen && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1e1e2e' }}>
              {/* Usage bar */}
              {usage && (
                <div style={{ margin: '16px 0 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: '#8b8fa3' }}>API Calls bulan ini</span>
                    <span style={{ color: '#e8eaf0', fontWeight: 700 }}>{fmt(usage.totalRequests)} / {usage.monthlyLimit === 0 ? '∞' : fmt(usage.monthlyLimit)}</span>
                  </div>
                  <div style={{ height: 6, background: '#1a1a28', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 80 ? '#ef4444' : '#4f6af6', borderRadius: 3, transition: 'width .3s' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#8b8fa3' }}>{keys.length} key aktif</span>
                <button onClick={() => { setShowKeyModal(true); setNewKey('') }} style={{
                  padding: '7px 16px', background: '#4f6af6', color: '#fff', border: 'none',
                  borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13
                }}>+ Buat Key</button>
              </div>

              {keys.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '16px 0', fontSize: 14 }}>Belum ada API key.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {keys.map(k => (
                    <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#0d0d1a', borderRadius: 9 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{k.name || 'API Key'}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{k.maskedKey}</div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{k.tier} · {k.requestCount || 0} calls · {fmtDate(k.createdAt)}</div>
                      </div>
                      <button onClick={() => revokeKey(k.id)} style={{ padding: '5px 12px', background: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Create Key Modal */}
      {showKeyModal && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, padding: 32, width: '90%', maxWidth: 400 }}>
            <h3 style={{ marginBottom: 20 }}>Buat API Key Baru</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#8b8fa3', marginBottom: 6 }}>Nama Key</label>
              <input type="text" placeholder="Contoh: Production Key" value={keyName} onChange={e => setKeyName(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', background: '#0d0d1a', border: '1px solid #2a2a3a', borderRadius: 9, color: '#e8eaf0', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#8b8fa3', marginBottom: 6 }}>Tier</label>
              <select value={keyTier} onChange={e => setKeyTier(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', background: '#0d0d1a', border: '1px solid #2a2a3a', borderRadius: 9, color: '#e8eaf0', fontFamily: 'inherit', fontSize: 14 }}>
                <option value="free">Free (10 req/min)</option>
                <option value="pro">Pro (100 req/min)</option>
              </select>
            </div>
            {newKey && (
              <div style={{ margin: '0 0 16px', padding: 12, background: '#0d0d1a', borderRadius: 9, fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>
                <div style={{ color: '#f59e0b', marginBottom: 6, fontFamily: 'inherit', fontSize: 13 }}>⚠️ Copy sekarang — tidak ditampilkan lagi!</div>
                {newKey}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              {!newKey ? (
                <button onClick={createKey} style={{ flex: 1, padding: '11px 0', background: '#4f6af6', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>Buat</button>
              ) : (
                <button onClick={() => { setShowKeyModal(false); setNewKey(''); setKeyName('') }} style={{ flex: 1, padding: '11px 0', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>✓ Selesai</button>
              )}
              <button onClick={() => { setShowKeyModal(false); setNewKey('') }} style={{ padding: '11px 20px', background: '#1a1a28', border: '1px solid #2a2a3a', color: '#8b8fa3', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
