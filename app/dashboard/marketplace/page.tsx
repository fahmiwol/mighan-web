'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PortalNav from '../../../components/PortalNav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mighan.com'

interface NpcTemplate {
  id: string; name: string; role: string; color: string; icon: string
  priceIxc: number; rarity: string; category: string; skills: string[]; catchphrase: string
}
interface ObjectTemplate {
  id: string; name: string; category: string; icon: string
  price: number; rarity: string; description: string; functionType?: string
}
interface Room { id: string; name: string }

const RARITY_COLOR: Record<string, string> = {
  Common: '#9ca3af', Uncommon: '#22c55e', Rare: '#3b82f6', Epic: '#a855f7', Legendary: '#f59e0b'
}
const CATEGORIES_NPC = ['All', 'Support', 'Sales', 'Content', 'Marketing', 'Analytics', 'Technical', 'Education', 'HR', 'Creative', 'Research', 'Operations']
const CATEGORIES_OBJ = ['All', 'Seats', 'Tables', 'Furniture', 'Electronics', 'Deco', 'Lighting', 'Storage', 'Interactive']

function MarketplaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'npcs' | 'objects'>(
    searchParams.get('tab') === 'objects' ? 'objects' : 'npcs'
  )
  const [npcs, setNpcs] = useState<NpcTemplate[]>([])
  const [objects, setObjects] = useState<ObjectTemplate[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<NpcTemplate | null>(null)
  const [targetRoom, setTargetRoom] = useState('')
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState('')

  function getHeaders() {
    const t = localStorage.getItem('mighan_user_token')
    return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) }
  }
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const loadData = useCallback(async () => {
    const t = localStorage.getItem('mighan_user_token')
    if (!t) { router.push('/login'); return }
    const [npcRes, objRes, roomRes] = await Promise.all([
      fetch(`${API}/api/v1/marketplace/npcs`).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/v1/marketplace/objects`).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/v1/rooms`, { headers: getHeaders() }).then(r => r.json()).catch(() => null),
    ])
    if (npcRes?.ok) setNpcs(npcRes.data)
    if (objRes?.ok) setObjects(objRes.data)
    if (roomRes?.ok) setRooms(roomRes.data.rooms || [])
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  async function hireNpc(npc: NpcTemplate) {
    if (!targetRoom) { showToast('Pilih room dulu'); return }
    setAdding(true)
    try {
      const r = await fetch(`${API}/api/v1/rooms/${targetRoom}/npcs`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ templateId: npc.id })
      }).then(r => r.json())
      if (r.ok) { showToast(`${npc.name} berhasil dipekerjakan!`); setSelectedItem(null) }
      else showToast(r.error || 'Gagal')
    } finally { setAdding(false) }
  }

  async function addObject(obj: ObjectTemplate) {
    if (!targetRoom) { showToast('Pilih room dulu'); return }
    setAdding(true)
    try {
      const r = await fetch(`${API}/api/v1/rooms/${targetRoom}/objects`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ templateId: obj.id })
      }).then(r => r.json())
      if (r.ok) { showToast(`${obj.name} ditambahkan ke room!`) }
      else showToast(r.error || 'Gagal')
    } finally { setAdding(false) }
  }

  const filteredNpcs = npcs.filter(n =>
    (filter === 'All' || n.category === filter) &&
    (n.name.toLowerCase().includes(search.toLowerCase()) || n.role.toLowerCase().includes(search.toLowerCase()))
  )
  const filteredObjs = objects.filter(o =>
    (filter === 'All' || o.category === filter) &&
    o.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', color: '#fff', fontFamily: 'Nunito, sans-serif' }}>
      <PortalNav />
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ marginBottom: 6, fontSize: 26, fontWeight: 900 }}>🛒 Marketplace</h1>
        <p style={{ color: '#8b8fa3', marginBottom: 24, fontSize: 14 }}>Hire AI NPC dan beli decorations untuk room kamu.</p>

        {/* Tab + Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#111120', borderRadius: 10, padding: 3 }}>
            {(['npcs', 'objects'] as const).map(t => (
              <button key={t} onClick={() => { setActiveTab(t); setFilter('All') }} style={{
                background: activeTab === t ? '#4f6af6' : 'transparent',
                color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8,
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14
              }}>
                {t === 'npcs' ? '🤖 NPC Agents' : '📦 Objects'}
              </button>
            ))}
          </div>
          <input
            placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, background: '#111120', border: '1px solid #1e1e2e', color: '#fff', padding: '9px 14px', borderRadius: 9, fontFamily: 'inherit', fontSize: 14 }}
          />
          {/* Room picker */}
          {rooms.length > 0 && (
            <select value={targetRoom} onChange={e => setTargetRoom(e.target.value)}
              style={{ background: '#111120', border: '1px solid #1e1e2e', color: targetRoom ? '#fff' : '#8b8fa3', padding: '9px 14px', borderRadius: 9, fontFamily: 'inherit', fontSize: 14 }}>
              <option value="">Pilih room...</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          )}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {(activeTab === 'npcs' ? CATEGORIES_NPC : CATEGORIES_OBJ).map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              background: filter === c ? '#4f6af6' : '#111120',
              color: filter === c ? '#fff' : '#8b8fa3',
              border: `1px solid ${filter === c ? '#4f6af6' : '#1e1e2e'}`,
              padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit'
            }}>
              {c}
            </button>
          ))}
        </div>

        {/* NPC Grid */}
        {activeTab === 'npcs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {filteredNpcs.map(npc => (
              <div key={npc.id} style={{ background: '#111120', border: `1px solid ${npc.color}33`, borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer', transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = npc.color + '88')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = npc.color + '33')}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${npc.color}dd, ${npc.color}66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤖</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{npc.name}</div>
                    <div style={{ color: '#8b8fa3', fontSize: 11, lineHeight: 1.4 }}>{npc.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <span style={{ background: RARITY_COLOR[npc.rarity] + '22', color: RARITY_COLOR[npc.rarity], fontSize: 10, padding: '3px 9px', borderRadius: 10, fontWeight: 700 }}>{npc.rarity}</span>
                  <span style={{ background: '#1e1e2e', color: '#8b8fa3', fontSize: 10, padding: '3px 9px', borderRadius: 10 }}>{npc.category}</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: 11, margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>"{npc.catchphrase}"</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto' }}>
                  {(npc.skills || []).slice(0, 3).map(s => (
                    <span key={s} style={{ background: '#1e1e2e', color: '#8b8fa3', fontSize: 10, padding: '2px 7px', borderRadius: 6 }}>{s}</span>
                  ))}
                  {npc.skills && npc.skills.length > 3 && <span style={{ color: '#8b8fa3', fontSize: 10 }}>+{npc.skills.length - 3}</span>}
                </div>
                <button
                  onClick={() => { if (!targetRoom) { showToast('Pilih room dulu!'); return } hireNpc(npc) }}
                  disabled={adding}
                  style={{ background: npc.priceIxc === 0 ? '#22c55e' : '#4f6af6', color: '#fff', border: 'none', padding: '9px 0', borderRadius: 9, cursor: adding ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 14, marginTop: 4 }}
                >
                  {npc.priceIxc === 0 ? '✅ Hire Gratis' : `⚡ ${npc.priceIxc} IX`}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Objects Grid */}
        {activeTab === 'objects' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {filteredObjs.map(obj => (
              <div key={obj.id} style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{obj.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{obj.name}</div>
                    <div style={{ color: '#8b8fa3', fontSize: 11 }}>{obj.category}</div>
                  </div>
                </div>
                <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>{obj.description}</p>
                <div style={{ display: 'flex', gap: 5 }}>
                  <span style={{ background: RARITY_COLOR[obj.rarity] + '22', color: RARITY_COLOR[obj.rarity], fontSize: 10, padding: '3px 9px', borderRadius: 10, fontWeight: 700 }}>{obj.rarity}</span>
                  {obj.functionType && obj.functionType !== 'null' && (
                    <span style={{ background: '#4f6af622', color: '#4f6af6', fontSize: 10, padding: '3px 9px', borderRadius: 10 }}>⚡ Interactive</span>
                  )}
                </div>
                <button
                  onClick={() => { if (!targetRoom) { showToast('Pilih room dulu!'); return } addObject(obj) }}
                  disabled={adding}
                  style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '9px 0', borderRadius: 9, cursor: adding ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, marginTop: 'auto' }}
                >
                  + Tambah • {obj.price} IX
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div style={{ background: '#0d0d1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b8fa3' }}>Loading...</div>}>
      <MarketplaceContent />
    </Suspense>
  )
}
