'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mighan.com'
const OPS_URL = 'https://ops.mighan.com'

interface RoomState {
  room: {
    id: string
    name: string
    theme: string
    description: string | null
    maxNpcSlots: number
    maxObjectSlots: number
    usedNpcSlots: number
    usedObjectSlots: number
    visibility: string
    isActive: boolean
  }
  npcs: Array<{ id: string; name: string; role: string; avatarUrl: string | null; color: string }>
  objects: Array<{ id: string; name: string; modelType: string; functionType: string | null; color: string | null }>
  config: { theme: string; lighting: object; floorType: string }
}

export default function RoomViewerPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string

  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [iframeLoaded, setIframeLoaded] = useState(false)

  function getHeaders(t: string) {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }
  }

  const fetchRoomState = useCallback(async (t: string) => {
    try {
      const res = await fetch(`${API}/api/v1/rooms/${roomId}/state`, { headers: getHeaders(t) })
      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Room tidak ditemukan')
        return
      }
      setRoomState(data.data)
    } catch {
      setError('Gagal memuat room state')
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

  const iframeUrl = token && roomId
    ? `${OPS_URL}/room-viewer?roomId=${encodeURIComponent(roomId)}&token=${encodeURIComponent(token)}&mode=user`
    : ''

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#8b8fa3', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #4f6af6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p>Memuat room...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'Nunito, sans-serif' }}>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d0d1a', fontFamily: 'Nunito, sans-serif' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'rgba(13,13,26,0.95)', borderBottom: '1px solid #1e1e2e', flexShrink: 0, backdropFilter: 'blur(8px)' }}>
        <button
          onClick={() => router.push('/dashboard/rooms')}
          style={{ background: '#1e1e2e', border: 'none', color: '#8b8fa3', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}
        >
          ← Rooms
        </button>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>
            {roomState?.room.name}
          </span>
          <span style={{ color: '#8b8fa3', fontSize: 12, marginLeft: 10 }}>
            🎨 {roomState?.room.theme} &nbsp;·&nbsp;
            🤖 {roomState?.npcs.length} NPC &nbsp;·&nbsp;
            📦 {roomState?.objects.length} object
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#8b8fa3', background: '#1e1e2e', padding: '4px 10px', borderRadius: 20 }}>
            {roomState?.room.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
          </span>
          <button
            onClick={() => router.push(`/dashboard/rooms`)}
            style={{ background: '#1e1e2e', border: 'none', color: '#8b8fa3', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}
            title="Kelola room"
          >
            ⚙️ Kelola
          </button>
        </div>
      </div>

      {/* Room iframe or placeholder */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!iframeLoaded && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#0d0d1a', zIndex: 10, color: '#8b8fa3'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🌐</div>
            <h3 style={{ color: '#fff', marginBottom: 8 }}>Membuka {roomState?.room.name}</h3>
            <p style={{ fontSize: 13, textAlign: 'center', maxWidth: 320 }}>
              Menghubungkan ke engine 3D...
            </p>
            <div style={{ marginTop: 24, width: 200, height: 3, background: '#1e1e2e', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: '#4f6af6', borderRadius: 2, animation: 'pulse 1.5s ease infinite' }} />
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }`}</style>
          </div>
        )}
        {iframeUrl && (
          <iframe
            src={iframeUrl}
            onLoad={() => setIframeLoaded(true)}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="camera; microphone; clipboard-write"
            title={`Room: ${roomState?.room.name}`}
          />
        )}
      </div>
    </div>
  )
}
