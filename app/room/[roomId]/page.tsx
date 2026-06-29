'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mighan.com'
const OPS_URL = 'https://ops.mighan.com'

interface NPC {
  id: string; name: string; role: string; avatarUrl: string | null; color: string; skills: string[]
}
interface RoomObject {
  id: string; name: string; modelType: string; functionType: string | null; color: string | null
}
interface RoomState {
  room: {
    id: string; name: string; theme: string; description: string | null
    maxNpcSlots: number; maxObjectSlots: number; usedNpcSlots: number; usedObjectSlots: number
    visibility: string; isActive: boolean
  }
  npcs: NPC[]
  objects: RoomObject[]
  config: { theme: string; lighting: { bg: string; color: string }; floorType: string }
}

const THEME_BG: Record<string, string> = {
  modern: '#0d0d1a', cyberpunk: '#060612', corporate: '#0a0f1e',
  minimalist: '#111118', fantasy: '#0a0a15'
}
const THEME_ACCENT: Record<string, string> = {
  modern: '#4f6af6', cyberpunk: '#00f0ff', corporate: '#2563eb',
  minimalist: '#6366f1', fantasy: '#a855f7'
}

export default function RoomViewerPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string

  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState<'dashboard' | '3d'>('dashboard')
  const [iframeError, setIframeError] = useState(false)

  function getHeaders(t: string) {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }
  }

  const fetchRoomState = useCallback(async (t: string) => {
    try {
      const res = await fetch(`${API}/api/v1/rooms/${roomId}/state`, { headers: getHeaders(t) })
      const data = await res.json()
      if (!data.ok) { setError(data.error || 'Room tidak ditemukan'); return }
      setRoomState(data.data)
    } catch {
      setError('Gagal memuat room. Cek koneksi internet.')
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    const t = localStorage.getItem('mighan_user_token') || ''
    if (!t) { router.push('/login'); return }
    setToken(t)
    fetchRoomState(t)
  }, [fetchRoomState, router])

  const bg = roomState ? (THEME_BG[roomState.room.theme] || '#0d0d1a') : '#0d0d1a'
  const accent = roomState ? (THEME_ACCENT[roomState.room.theme] || '#4f6af6') : '#4f6af6'
  const iframeUrl = token && roomId
    ? `${OPS_URL}/room-viewer?roomId=${encodeURIComponent(roomId)}&token=${encodeURIComponent(token)}&mode=user`
    : ''

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ textAlign: 'center', color: '#8b8fa3' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #4f6af6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p>Memuat room...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏚️</div>
        <h2 style={{ marginBottom: 8, color: '#ef4444' }}>Room Tidak Ditemukan</h2>
        <p style={{ color: '#8b8fa3', marginBottom: 24 }}>{error}</p>
        <button onClick={() => router.push('/dashboard/rooms')} style={{ background: '#4f6af6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
          ← Kembali ke Rooms
        </button>
      </div>
    </div>
  )

  const room = roomState!.room

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: bg, fontFamily: 'Nunito, sans-serif', color: '#fff' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', background: 'rgba(0,0,0,0.4)', borderBottom: `1px solid ${accent}22`, flexShrink: 0, backdropFilter: 'blur(12px)' }}>
        <button onClick={() => router.push('/dashboard/rooms')} style={{ background: '#ffffff14', border: 'none', color: '#8b8fa3', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
          ← Rooms
        </button>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{room.name}</span>
          <span style={{ color: '#8b8fa3', fontSize: 12, marginLeft: 10 }}>
            🎨 {room.theme} &nbsp;·&nbsp; 🤖 {roomState!.npcs.length}/{room.maxNpcSlots} NPC &nbsp;·&nbsp; 📦 {roomState!.objects.length}/{room.maxObjectSlots} obj
          </span>
        </div>
        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4, background: '#ffffff10', borderRadius: 8, padding: 3 }}>
          {(['dashboard', '3d'] as const).map(v => (
            <button key={v} onClick={() => { setView(v); setIframeError(false) }} style={{ background: view === v ? accent : 'transparent', color: view === v ? '#fff' : '#8b8fa3', border: 'none', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600, transition: 'all .2s' }}>
              {v === 'dashboard' ? '📊 Overview' : '🌐 3D World'}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: '#8b8fa3', background: '#ffffff10', padding: '4px 10px', borderRadius: 20 }}>
          {room.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
        </span>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* 2D Dashboard view */}
        {view === 'dashboard' && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
            {/* Room header */}
            <div style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}08)`, border: `1px solid ${accent}33`, borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ margin: '0 0 6px', fontSize: 24, color: '#fff' }}>{room.name}</h1>
                  {room.description && <p style={{ color: '#8b8fa3', margin: 0, fontSize: 14 }}>{room.description}</p>}
                </div>
                <button onClick={() => { setView('3d'); setIframeError(false) }} style={{ background: accent, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  🌐 Enter 3D World →
                </button>
              </div>
              {/* Slot usage */}
              <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'NPC Slots', used: roomState!.npcs.length, max: room.maxNpcSlots, color: accent },
                  { label: 'Object Slots', used: roomState!.objects.length, max: room.maxObjectSlots, color: '#8b5cf6' },
                ].map(s => (
                  <div key={s.label} style={{ flex: '1 1 180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8b8fa3', marginBottom: 4 }}>
                      <span>{s.label}</span><span>{s.used}/{s.max}</span>
                    </div>
                    <div style={{ height: 5, background: '#ffffff10', borderRadius: 3 }}>
                      <div style={{ width: `${Math.min(100, (s.used / s.max) * 100)}%`, height: '100%', background: s.color, borderRadius: 3, transition: 'width .5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NPCs + Objects grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* NPCs */}
              <div style={{ background: '#ffffff07', border: '1px solid #ffffff12', borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 14, color: '#8b8fa3', textTransform: 'uppercase', letterSpacing: 1 }}>🤖 NPCs ({roomState!.npcs.length})</h3>
                {roomState!.npcs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#8b8fa3' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🤖</div>
                    <p style={{ fontSize: 13, margin: 0 }}>Belum ada NPC. Hire dari Marketplace!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {roomState!.npcs.map(npc => (
                      <div key={npc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#ffffff05', borderRadius: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: npc.color || accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{npc.name}</div>
                          <div style={{ color: '#8b8fa3', fontSize: 12 }}>{npc.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => router.push(`/dashboard/rooms/${roomId}`)} style={{ marginTop: 14, width: '100%', background: `${accent}22`, color: accent, border: `1px solid ${accent}44`, padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>
                  + Hire NPC
                </button>
              </div>

              {/* Objects */}
              <div style={{ background: '#ffffff07', border: '1px solid #ffffff12', borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 14, color: '#8b8fa3', textTransform: 'uppercase', letterSpacing: 1 }}>📦 Objects ({roomState!.objects.length})</h3>
                {roomState!.objects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#8b8fa3' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
                    <p style={{ fontSize: 13, margin: 0 }}>Belum ada object. Browse Marketplace!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {roomState!.objects.map(obj => (
                      <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#ffffff05', borderRadius: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: obj.color || '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📦</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{obj.name}</div>
                          <div style={{ color: '#8b8fa3', fontSize: 12 }}>{obj.modelType}{obj.functionType ? ` · ${obj.functionType}` : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => router.push(`/dashboard/rooms/${roomId}`)} style={{ marginTop: 14, width: '100%', background: '#8b5cf622', color: '#8b5cf6', border: '1px solid #8b5cf644', padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>
                  + Add Object
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3D iframe view */}
        {view === '3d' && (
          <div style={{ height: '100%', position: 'relative' }}>
            {iframeError ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8b8fa3', textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🌐</div>
                <h3 style={{ color: '#fff', marginBottom: 8 }}>3D Engine Belum Tersedia</h3>
                <p style={{ maxWidth: 340, fontSize: 14 }}>
                  Room viewer 3D sedang dipersiapkan. Gunakan Overview untuk manage NPC dan object.
                </p>
                <button onClick={() => setView('dashboard')} style={{ marginTop: 20, background: accent, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700 }}>
                  ← Ke Overview
                </button>
              </div>
            ) : (
              <iframe
                src={iframeUrl}
                onError={() => setIframeError(true)}
                onLoad={(e) => {
                  // If iframe loaded a 404/error page, show fallback
                  try {
                    const iframe = e.currentTarget as HTMLIFrameElement
                    if (iframe.contentDocument?.title?.includes('404')) setIframeError(true)
                  } catch { /* cross-origin — assume loaded ok */ }
                }}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allow="camera; microphone; clipboard-write"
                title={`Room 3D: ${room.name}`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
