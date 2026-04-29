'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../components/AuthProvider'
import '../(auth)/portal.css'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

interface Profile {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  tier: string
  emailVerified: boolean
  createdAt: string
  activeKeys: number
}

export default function ProfilePage() {
  const router = useRouter()
  const { logout, refreshUser } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  function getHeaders() {
    const token = localStorage.getItem('mighan_user_token')
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    const token = localStorage.getItem('mighan_user_token')
    if (!token) { router.push('/login'); return }
    fetch(`${API}/api/v1/user/profile`, { headers: getHeaders() })
      .then(r => r.json())
      .then(r => {
        if (r.success && r.data) {
          setProfile(r.data)
          setDisplayName(r.data.displayName || '')
          setAvatarUrl(r.data.avatarUrl || '')
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const r = await fetch(`${API}/api/v1/user/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ displayName, avatarUrl: avatarUrl || undefined })
    }).then(r => r.json()).catch(() => null)
    setSaving(false)

    if (r?.success) {
      setProfile(prev => prev ? { ...prev, displayName, avatarUrl } : prev)
      await refreshUser()
      setEditing(false)
      showToast('Profil berhasil diperbarui!')
    } else {
      showToast('Gagal menyimpan perubahan')
    }
  }

  function fmtDate(iso: string) {
    return iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
  }

  if (!profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f0f14', color: '#e8eaf0' }}>
      <p>Memuat profil...</p>
    </div>
  )

  const initial = (profile.displayName || profile.email || 'U')[0].toUpperCase()

  return (
    <div style={{ background: '#0f0f14', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="portal-container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>👤 Profil</h1>
            <p style={{ color: '#8b8fa3', fontSize: 14, marginTop: 4 }}>Kelola informasi akun Anda</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/dashboard" className="btn-sm" style={{ background: '#242430', color: '#e8eaf0', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>← Dashboard</Link>
            <button className="btn-sm" onClick={logout} style={{ background: '#242430', color: '#e8eaf0' }}>Keluar</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>

          {/* Avatar Card */}
          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 14, padding: 28, textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #4f6af6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, margin: '0 auto 16px',
              overflow: 'hidden'
            }}>
              {profile.avatarUrl
                ? <img src={profile.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initial}
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{profile.displayName}</div>
            <div style={{ color: '#8b8fa3', fontSize: 13, marginBottom: 12 }}>{profile.email}</div>
            <span className="user-tier" style={{ fontSize: 13 }}>
              {(profile.tier || 'free').charAt(0).toUpperCase() + (profile.tier || 'free').slice(1)}
            </span>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #2a2a3a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#8b8fa3', fontSize: 13 }}>API Keys Aktif</span>
                <span style={{ fontWeight: 600 }}>{profile.activeKeys}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#8b8fa3', fontSize: 13 }}>Email Verified</span>
                <span style={{ color: profile.emailVerified ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
                  {profile.emailVerified ? '✓ Ya' : '✗ Belum'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8b8fa3', fontSize: 13 }}>Bergabung</span>
                <span style={{ fontSize: 13 }}>{fmtDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 14, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Informasi Akun</h2>
              {!editing && (
                <button className="btn-sm" onClick={() => setEditing(true)} style={{ background: '#4f6af6', color: 'white' }}>
                  Edit Profil
                </button>
              )}
            </div>

            {!editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Nama Tampilan', value: profile.displayName },
                  { label: 'Email', value: profile.email },
                  { label: 'Tier', value: (profile.tier || 'free').charAt(0).toUpperCase() + (profile.tier || 'free').slice(1) },
                  { label: 'User ID', value: profile.id, mono: true },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#8b8fa3', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{f.label}</span>
                    <span style={{ fontFamily: f.mono ? 'monospace' : undefined, fontSize: f.mono ? 12 : 15, color: '#e8eaf0' }}>{f.value || '-'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group">
                  <label>Nama Tampilan</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Nama Anda"
                    required
                    style={{ width: '100%', padding: '12px 14px', background: '#0f0f14', border: '1px solid #2a2a3a', borderRadius: 10, color: '#e8eaf0', fontSize: 14 }}
                  />
                </div>
                <div className="form-group">
                  <label>URL Avatar <span style={{ color: '#8b8fa3', fontWeight: 400 }}>(opsional)</span></label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '12px 14px', background: '#0f0f14', border: '1px solid #2a2a3a', borderRadius: 10, color: '#e8eaf0', fontSize: 14 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button type="button" className="btn" onClick={() => { setEditing(false); setDisplayName(profile.displayName); setAvatarUrl(profile.avatarUrl || '') }}
                    style={{ background: '#242430', color: '#e8eaf0' }}>
                    Batal
                  </button>
                </div>
              </form>
            )}

            {/* Danger Zone */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #2a2a3a' }}>
              <h3 style={{ color: '#f87171', fontSize: 14, marginBottom: 12 }}>Zona Berbahaya</h3>
              <p style={{ color: '#8b8fa3', fontSize: 13, marginBottom: 12 }}>
                Logout dari semua perangkat akan membatalkan semua sesi aktif.
              </p>
              <button className="btn-sm btn-danger" onClick={logout}>Keluar dari Semua Perangkat</button>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  )
}
