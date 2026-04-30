'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PortalNav from '../../../../components/PortalNav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mighan.com'

interface NpcTemplate {
  id: string; name: string; role: string; color: string; icon: string
  priceIxc: number; rarity: string; category: string; skills: string[]
  catchphrase: string
}
interface HiredNpc { id: string; name: string; role: string; appearance: { color?: string } | null; skills: unknown }
interface HiredObj { id: string; name: string; modelType: string; color: string; functionType: string }
interface Room {
  id: string; name: string; theme: string; description: string | null
  maxNpcSlots: number; maxObjectSlots: number; usedNpcSlots: number; usedObjectSlots: number
  visibility: string; subdomain: string | null; npcs: HiredNpc[]; objects: HiredObj[]
}

const THEME_ACCENT: Record<string, string> = {
  modern: '#4f6af6', cyberpunk: '#00f0ff', corporate: '#2563eb', minimalist: '#6366f1', fantasy: '#a855f7'
}
const RARITY_COLOR: Record<string, string> = {
  Common: '#9ca3af', Uncommon: '#22c55e', Rare: '#3b82f6', Epic: '#a855f7', Legendary: '#f59e0b'
}

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [room, setRoom] = useState<Room | null>(null)
  const [tab, setTab] = useState<'overview' | 'npcs' | 'objects' | 'settings' | 'share'>('overview')
  const [loading, setLoading] = useState(true)
  const [npcCatalog, setNpcCatalog] = useState<NpcTemplate[]>([])
  const [showHireModal, setShowHireModal] = useState(false)
  const [hiring, setHiring] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [settings, setSettings] = useState({ name: '', description: '', theme: 'modern', visibility: 'private' })
  const [saving, setSaving] = useState(false)

  function getHeaders() {
    const t = localStorage.getItem('mighan_user_token')
    return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) }
  }
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const loadRoom = useCallback(async () => {
    const t = localStorage.getItem('mighan_user_token')
    if (!t) { router.push('/login'); return }
    try {
      const r = await fetch(`${API}/api/v1/rooms/${roomId}`, { headers: getHeaders() }).then(r => r.json())
      if (r.ok) {
        setRoom(r.data)
        setSettings({ name: r.data.name, description: r.data.description || '', theme: r.data.theme, visibility: r.data.visibility })
      } else { router.push('/dashboard/rooms') }
    } finally { setLoading(false) }
  }, [roomId, router])

  const loadCatalog = useCallback(async () => {
    const r = await fetch(`${API}/api/v1/marketplace/npcs`).then(r => r.json()).catch(() => null)
    if (r?.ok) setNpcCatalog(r.data)
  }, [])

  useEffect(() => { loadRoom(); loadCatalog() }, [loadRoom, loadCatalog])

  async function hireNpc(templateId: string) {
    if (!room) return
    setHiring(templateId)
    try {
      const r = await fetch(`${API}/api/v1/rooms/${roomId}/npcs`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ templateId })
      }).then(r => r.json())
      if (r.ok) { showToast('NPC berhasil dipekerjakan!'); setShowHireModal(false); loadRoom() }
      else showToast(r.error || 'Gagal hire NPC')
    } finally { setHiring(null) }
  }

  async function fireNpc(npcId: string, npcName: string) {
    if (!confirm(`Lepas ${npcName} dari room ini?`)) return
    const r = await fetch(`${API}/api/v1/rooms/${roomId}/npcs/${npcId}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json())
    if (r.ok) { showToast('NPC dilepas'); loadRoom() }
    else showToast(r.error || 'Gagal')
  }

  async function removeObject(objId: string, objName: string) {
    if (!confirm(`Hapus ${objName}?`)) return
    const r = await fetch(`${API}/api/v1/rooms/${roomId}/objects/${objId}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json())
    if (r.ok) { showToast('Object dihapus'); loadRoom() }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const r = await fetch(`${API}/api/v1/rooms/${roomId}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify(settings)
      }).then(r => r.json())
      if (r.ok) { showToast('Tersimpan!'); loadRoom() }
      else showToast(r.error || 'Gagal')
    } finally { setSaving(false) }
  }

  if (loading || !room) return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8fa3', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #4f6af6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 12px' }} />
        <p>Memuat room...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  const accent = THEME_ACCENT[room.theme] || '#4f6af6'
  const shareUrl = `https://room.mighan.com/${room.id}`

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', color: '#fff', fontFamily: 'Nunito, sans-serif' }}>
      <PortalNav />

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => router.push('/dashboard/rooms')} style={{ background: '#1e1e2e', border: 'none', color: '#8b8fa3', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
            ← Rooms
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{room.name}</h1>
            <span style={{ color: '#8b8fa3', fontSize: 13 }}>🎨 {room.theme} · {room.visibility === 'public' ? '🌐 Public' : '🔒 Private'}</span>
          </div>
          <a href={`/room/${room.id}`} style={{ background: accent, color: '#fff', padding: '9px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Enter Room →
          </a>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #1e1e2e', marginBottom: 24 }}>
          {(['overview', 'npcs', 'objects', 'settings', 'share'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none', color: tab === t ? accent : '#8b8fa3',
              borderBottom: tab === t ? `2px solid ${accent}` : '2px solid transparent',
              padding: '10px 16px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: tab === t ? 700 : 400,
              marginBottom: -1, textTransform: 'capitalize'
            }}>
              {t === 'overview' && '📊 '}{t === 'npcs' && '🤖 '}{t === 'objects' && '📦 '}{t === 'settings' && '⚙️ '}{t === 'share' && '🔗 '}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'NPC', icon: '🤖', used: room.npcs.length, max: room.maxNpcSlots, color: accent },
              { label: 'Objects', icon: '📦', used: room.objects.length, max: room.maxObjectSlots, color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700 }}>{s.icon} {s.label}</span>
                  <span style={{ color: '#8b8fa3', fontSize: 13 }}>{s.used}/{s.max}</span>
                </div>
                <div style={{ height: 6, background: '#1e1e2e', borderRadius: 3 }}>
                  <div style={{ width: `${Math.min(100, (s.used/s.max)*100)}%`, height: '100%', background: s.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 12, padding: 20, gridColumn: '1/-1' }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>🔗 Room URL</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={shareUrl} style={{ flex: 1, background: '#0d0d1a', border: '1px solid #2a2a3a', color: '#fff', padding: '8px 12px', borderRadius: 8, fontFamily: 'monospace', fontSize: 13 }} />
                <button onClick={() => { navigator.clipboard.writeText(shareUrl); showToast('Copied!') }} style={{ background: accent, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NPCs tab */}
        {tab === 'npcs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: '#8b8fa3', fontSize: 14 }}>{room.npcs.length}/{room.maxNpcSlots} NPC slots</span>
              <button
                onClick={() => setShowHireModal(true)}
                disabled={room.npcs.length >= room.maxNpcSlots}
                style={{ background: room.npcs.length >= room.maxNpcSlots ? '#2a2a3a' : accent, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9, cursor: room.npcs.length >= room.maxNpcSlots ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14 }}
              >
                + Hire NPC
              </button>
            </div>
            {room.npcs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: '#111120', borderRadius: 12, border: `1px dashed ${accent}44` }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
                <h3>Belum ada NPC</h3>
                <p style={{ color: '#8b8fa3', fontSize: 14 }}>Hire NPC dari marketplace untuk mulai berinteraksi dengan pengunjung.</p>
                <button onClick={() => setShowHireModal(true)} style={{ background: accent, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, marginTop: 8 }}>
                  Browse & Hire NPC
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {room.npcs.map((npc) => (
                  <div key={npc.id} style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: (npc.appearance as { color?: string } | null)?.color || accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🤖</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{npc.name}</div>
                      <div style={{ color: '#8b8fa3', fontSize: 12, marginBottom: 8 }}>{npc.role}</div>
                      <button onClick={() => fireNpc(npc.id, npc.name)} style={{ background: '#2a2a3a', color: '#ef4444', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                        Lepas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Objects tab */}
        {tab === 'objects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: '#8b8fa3', fontSize: 14 }}>{room.objects.length}/{room.maxObjectSlots} object slots</span>
              <button onClick={() => router.push('/dashboard/marketplace?tab=objects')} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14 }}>
                + Add Object
              </button>
            </div>
            {room.objects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: '#111120', borderRadius: 12, border: '1px dashed #8b5cf644' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <h3>Belum ada object</h3>
                <p style={{ color: '#8b8fa3', fontSize: 14 }}>Tambahkan furniture dan object untuk mendekorasi room kamu.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {room.objects.map(obj => (
                  <div key={obj.id} style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: obj.color || '#8b5cf6' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{obj.name}</div>
                        <div style={{ color: '#8b8fa3', fontSize: 12 }}>{obj.modelType}</div>
                      </div>
                    </div>
                    <button onClick={() => removeObject(obj.id, obj.name)} style={{ background: '#2a2a3a', color: '#ef4444', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings tab */}
        {tab === 'settings' && (
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Nama Room', key: 'name' as const, type: 'text' },
                { label: 'Deskripsi', key: 'description' as const, type: 'textarea' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color: '#8b8fa3', fontSize: 13, display: 'block', marginBottom: 6 }}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={settings[f.key]} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: '#111120', border: '1px solid #2a2a3a', color: '#fff', padding: '10px 12px', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, resize: 'vertical', minHeight: 80, boxSizing: 'border-box' }} />
                  ) : (
                    <input value={settings[f.key]} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: '#111120', border: '1px solid #2a2a3a', color: '#fff', padding: '10px 12px', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }} />
                  )}
                </div>
              ))}
              <div>
                <label style={{ color: '#8b8fa3', fontSize: 13, display: 'block', marginBottom: 6 }}>Theme</label>
                <select value={settings.theme} onChange={e => setSettings(s => ({ ...s, theme: e.target.value }))}
                  style={{ width: '100%', background: '#111120', border: '1px solid #2a2a3a', color: '#fff', padding: '10px 12px', borderRadius: 8, fontFamily: 'inherit', fontSize: 14 }}>
                  {['modern', 'cyberpunk', 'corporate', 'minimalist', 'fantasy'].map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: '#8b8fa3', fontSize: 13, display: 'block', marginBottom: 6 }}>Visibility</label>
                <select value={settings.visibility} onChange={e => setSettings(s => ({ ...s, visibility: e.target.value }))}
                  style={{ width: '100%', background: '#111120', border: '1px solid #2a2a3a', color: '#fff', padding: '10px 12px', borderRadius: 8, fontFamily: 'inherit', fontSize: 14 }}>
                  <option value="private">🔒 Private</option>
                  <option value="public">🌐 Public</option>
                  <option value="unlisted">🔗 Unlisted</option>
                </select>
              </div>
              <button onClick={saveSettings} disabled={saving} style={{ background: accent, color: '#fff', border: 'none', padding: '11px 0', borderRadius: 9, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 15 }}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        )}

        {/* Share tab */}
        {tab === 'share' && (
          <div style={{ maxWidth: 500 }}>
            <div style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>🔗 Share Link</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input readOnly value={shareUrl} style={{ flex: 1, background: '#0d0d1a', border: '1px solid #2a2a3a', color: '#fff', padding: '10px 12px', borderRadius: 8, fontFamily: 'monospace', fontSize: 13 }} />
                <button onClick={() => { navigator.clipboard.writeText(shareUrl); showToast('Copied!') }} style={{ background: accent, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
                  Copy
                </button>
              </div>
              <p style={{ color: '#8b8fa3', fontSize: 13, margin: 0 }}>
                {room.visibility === 'private' ? '🔒 Room ini private — hanya kamu yang bisa akses.' : '🌐 Room ini public — siapa pun bisa akses via link.'}
              </p>
            </div>
            {room.visibility === 'private' && (
              <button onClick={() => setTab('settings')} style={{ background: '#1e1e2e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                Ubah ke Public →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hire NPC Modal */}
      {showHireModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #1e1e2e' }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>🤖 Hire NPC</h2>
              <button onClick={() => setShowHireModal(false)} style={{ background: 'none', border: 'none', color: '#8b8fa3', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ overflowY: 'auto', padding: 20, flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {npcCatalog.map(npc => (
                  <div key={npc.id} style={{ background: '#111120', border: `1px solid ${npc.color}33`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: npc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{npc.name}</div>
                        <div style={{ color: '#8b8fa3', fontSize: 11 }}>{npc.role}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ background: RARITY_COLOR[npc.rarity] + '22', color: RARITY_COLOR[npc.rarity], fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                        {npc.rarity}
                      </span>
                      <span style={{ background: '#1e1e2e', color: '#8b8fa3', fontSize: 10, padding: '2px 8px', borderRadius: 10 }}>
                        {npc.category}
                      </span>
                    </div>
                    <p style={{ color: '#8b8fa3', fontSize: 11, margin: 0, fontStyle: 'italic' }}>"{npc.catchphrase}"</p>
                    <button
                      onClick={() => hireNpc(npc.id)}
                      disabled={hiring === npc.id}
                      style={{
                        background: hiring === npc.id ? '#2a2a3a' : npc.priceIxc === 0 ? '#22c55e' : accent,
                        color: '#fff', border: 'none', padding: '8px 0', borderRadius: 8,
                        cursor: hiring === npc.id ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit', fontWeight: 700, fontSize: 13, marginTop: 'auto'
                      }}
                    >
                      {hiring === npc.id ? '⏳' : npc.priceIxc === 0 ? '✅ Hire Gratis' : `⚡ Hire • ${npc.priceIxc} IX`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
