'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/AuthProvider'
import PortalNav from '../../../components/PortalNav'
import CreateRoomModal from '../../../components/CreateRoomModal'
import '../../(auth)/portal.css'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

interface Room {
  id: string
  name: string
  description?: string
  subdomain?: string
  theme: string
  isActive: boolean
  visibility: string
  maxNpcSlots: number
  maxObjectSlots: number
  usedNpcSlots: number
  usedObjectSlots: number
  npcCount: number
  objectCount: number
  memberCount: number
  createdAt: string
}

interface RoomListResponse {
  ok: boolean
  data?: {
    rooms: Room[]
    tier: string
    limits: { maxRooms: number; maxNpcs: number; maxObjects: number }
    roomCount: number
    canCreate: boolean
  }
  error?: string
}

function getHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mighan_user_token') : null
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

const THEME_ICONS: Record<string, string> = {
  modern: '🏢',
  cyberpunk: '🌃',
  corporate: '💼',
  minimalist: '📐',
  fantasy: '🏰',
}

export default function RoomsPage() {
  const router = useRouter()
  const { user: authUser } = useAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [tier, setTier] = useState('free')
  const [limits, setLimits] = useState({ maxRooms: 1, maxNpcs: 3, maxObjects: 10 })
  const [roomCount, setRoomCount] = useState(0)
  const [canCreate, setCanCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const loadRooms = useCallback(async () => {
    setLoading(true)
    const r = await fetch(`${API}/api/v1/rooms`, { headers: getHeaders() })
      .then(r => r.json())
      .catch(() => null) as RoomListResponse | null
    if (r?.ok && r.data) {
      setRooms(r.data.rooms)
      setTier(r.data.tier)
      setLimits(r.data.limits)
      setRoomCount(r.data.roomCount)
      setCanCreate(r.data.canCreate)
    } else if (r?.error?.includes('Login required')) {
      router.push('/login')
    }
    setLoading(false)
  }, [router])

  useEffect(() => { loadRooms() }, [loadRooms])

  async function deleteRoom(id: string) {
    if (!confirm('Yakin ingin hapus room ini? Semua NPC dan object di dalamnya akan ikut terhapus.')) return
    const r = await fetch(`${API}/api/v1/rooms/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(r => r.json()).catch(() => null)
    if (r?.ok) { showToast('Room dihapus'); loadRooms() }
    else showToast(r?.error || 'Gagal menghapus room')
  }

  function handleRoomCreated() {
    setShowModal(false)
    loadRooms()
    showToast('Room berhasil dibuat!')
  }

  const initial = authUser?.displayName ? authUser.displayName[0].toUpperCase() : 'U'

  return (
    <div style={{ background: '#0f0f14', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <PortalNav />
      <div className="portal-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>🏠 My Rooms</h1>
            <p style={{color:'#8b8fa3',fontSize:14,marginTop:4}}>
              Kelola dunia virtualmu — {roomCount} / {limits.maxRooms} room
            </p>
          </div>
          <div className="user-info">
            <div className="user-avatar">{initial}</div>
            <div>
              <div className="user-name">{authUser?.displayName || authUser?.email || 'User'}</div>
              <span className="user-tier">{tier}</span>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={() => setShowModal(true)}
              disabled={!canCreate}
              className="btn-primary"
              style={{
                background: canCreate ? 'var(--primary)' : '#3a3a4a',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: canCreate ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              + Create New Room
            </button>
            {!canCreate && (
              <span style={{ color: '#f59e0b', fontSize: 13 }}>
                ⚠️ Batas room tercapai — <Link href="/dashboard/wallet" style={{color:'#4f6af6',textDecoration:'underline'}}>Upgrade ke Pro</Link>
              </span>
            )}
          </div>
          <Link href="/dashboard" style={{ color: '#8b8fa3', fontSize: 14, textDecoration: 'none' }}>
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#8b8fa3' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div>Memuat rooms...</div>
          </div>
        ) : rooms.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border)',
            borderRadius: 16,
            padding: 60,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏗️</div>
            <h3 style={{ marginBottom: 8 }}>Belum Punya Room</h3>
            <p style={{ color: '#8b8fa3', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
              Buat room pertamamu dan mulai bangun dunia virtual dengan AI agents.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🚀 Buat Room Pertama
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {rooms.map(room => (
              <div key={room.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 20,
                transition: 'transform .15s, box-shadow .15s',
              }}>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #4f6af620, #8b5cf620)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}>
                    {THEME_ICONS[room.theme] || '🏢'}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {room.isActive ? (
                      <span style={{
                        background: '#22c55e20',
                        color: '#22c55e',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 20,
                      }}>● Active</span>
                    ) : (
                      <span style={{
                        background: '#ef444420',
                        color: '#ef4444',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 20,
                      }}>● Inactive</span>
                    )}
                  </div>
                </div>

                {/* Room Info */}
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{room.name}</h3>
                <p style={{ color: '#8b8fa3', fontSize: 13, marginBottom: 12, minHeight: 20 }}>
                  {room.description || 'Tidak ada deskripsi'}
                </p>

                {/* Capacity Bars */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#8b8fa3' }}>👥 NPC</span>
                    <span style={{ color: '#e8eaf0' }}>{room.npcCount} / {room.maxNpcSlots}</span>
                  </div>
                  <div style={{ height: 6, background: '#2a2a3a', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, (room.npcCount / room.maxNpcSlots) * 100)}%`,
                      height: '100%',
                      background: room.npcCount >= room.maxNpcSlots ? '#ef4444' : '#4f6af6',
                      borderRadius: 3,
                      transition: 'width .3s',
                    }} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#8b8fa3' }}>🪑 Object</span>
                    <span style={{ color: '#e8eaf0' }}>{room.objectCount} / {room.maxObjectSlots}</span>
                  </div>
                  <div style={{ height: 6, background: '#2a2a3a', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, (room.objectCount / room.maxObjectSlots) * 100)}%`,
                      height: '100%',
                      background: room.objectCount >= room.maxObjectSlots ? '#ef4444' : '#8b5cf6',
                      borderRadius: 3,
                      transition: 'width .3s',
                    }} />
                  </div>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: '#8b8fa3', fontSize: 12 }}>
                    🎨 {room.theme.charAt(0).toUpperCase() + room.theme.slice(1)}
                  </span>
                  <span style={{ color: '#8b8fa3', fontSize: 12 }}>
                    👤 {room.memberCount} member
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`https://ops.mighan.com?roomId=${room.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      background: 'var(--primary)',
                      color: '#fff',
                      textAlign: 'center',
                      padding: '9px 0',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Enter →
                  </a>
                  <button
                    onClick={() => deleteRoom(room.id)}
                    style={{
                      background: '#2a2a3a',
                      color: '#ef4444',
                      border: 'none',
                      padding: '9px 14px',
                      borderRadius: 8,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                    title="Hapus room"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#22c55e',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            zIndex: 9999,
          }}>
            {toast}
          </div>
        )}
      </div>

      {showModal && (
        <CreateRoomModal
          onClose={() => setShowModal(false)}
          onCreated={handleRoomCreated}
          tier={tier}
          limits={limits}
          roomCount={roomCount}
        />
      )}
    </div>
  )
}
