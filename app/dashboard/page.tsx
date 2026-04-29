'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../components/AuthProvider'
import '../(auth)/portal.css'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

interface User { displayName?: string; email?: string; tier?: string; subscriptionTier?: string }
interface ApiKey { id: string; name: string; maskedKey: string; tier: string; requestCount: number; createdAt: string }
interface Usage { totalRequests: number; monthlyLimit: number; activeKeys: number }

function fmt(n: number) { if (n >= 1e6) return (n/1e6).toFixed(1)+'M'; if (n >= 1e3) return (n/1e3).toFixed(1)+'K'; return n.toString() }
function fmtDate(iso: string) { return iso ? new Date(iso).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'}) : '-' }

export default function DashboardPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [usage, setUsage] = useState<Usage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [keyTier, setKeyTier] = useState('free')
  const [newKey, setNewKey] = useState('')
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function getHeaders() {
    const token = localStorage.getItem('mighan_user_token')
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  }

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('mighan_user_token')
    if (!token) { router.push('/login'); return }
    const r = await fetch(`${API}/api/v1/auth/me`, { headers: getHeaders() }).then(r => r.json()).catch(() => null)
    if (r?.ok && r.user) setUser(r.user)
    else { localStorage.removeItem('mighan_user_token'); router.push('/login') }
  }, [router])

  const loadUsage = useCallback(async () => {
    const r = await fetch(`${API}/api/v1/user/usage`, { headers: getHeaders() }).then(r => r.json()).catch(() => null)
    if (r?.success) setUsage(r.data)
  }, [])

  const loadKeys = useCallback(async () => {
    const r = await fetch(`${API}/api/v1/user/keys`, { headers: getHeaders() }).then(r => r.json()).catch(() => null)
    if (r?.success) setKeys(r.data || [])
  }, [])

  useEffect(() => { loadUser(); loadUsage(); loadKeys() }, [])

  async function createKey() {
    const r = await fetch(`${API}/api/v1/user/keys`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ name: keyName, tier: keyTier })
    }).then(r => r.json()).catch(() => null)
    if (r?.success && r.data?.key) { setNewKey(r.data.key); showToast('API key berhasil dibuat!'); loadKeys(); loadUsage() }
    else showToast(r?.error || 'Gagal membuat key')
  }

  async function revokeKey(id: string) {
    if (!confirm('Yakin ingin revoke key ini?')) return
    const r = await fetch(`${API}/api/v1/user/keys/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()).catch(() => null)
    if (r?.success || r?.ok) { showToast('Key revoked'); loadKeys(); loadUsage() }
    else showToast('Gagal revoke key')
  }

  const pct = usage && usage.monthlyLimit > 0 ? Math.min(100, (usage.totalRequests / usage.monthlyLimit) * 100) : 0
  const initial = user ? (user.displayName || user.email || 'U')[0].toUpperCase() : 'U'

  return (
    <div style={{ background: '#0f0f14', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="portal-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>📊 Dashboard</h1>
            <p style={{color:'#8b8fa3',fontSize:14,marginTop:4}}>Kelola API keys dan monitor penggunaan</p>
          </div>
          <div className="user-info">
            <div className="user-avatar">{initial}</div>
            <div>
              <div className="user-name">{user?.displayName || user?.email || 'Loading...'}</div>
              <span className="user-tier">{user?.subscriptionTier || user?.tier || 'free'}</span>
            </div>
            <button className="btn-sm" onClick={logout}
              style={{marginLeft:12,background:'#242430',color:'#e8eaf0'}}>Keluar</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="label">API Calls Bulan Ini</div>
            <div className="value">{usage ? fmt(usage.totalRequests) : '0'}</div>
            <div className="change">dari {usage?.monthlyLimit === 0 ? '∞' : fmt(usage?.monthlyLimit ?? 500)} limit</div>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}} /></div>
          </div>
          <div className="stat-card">
            <div className="label">API Keys Aktif</div>
            <div className="value">{usage?.activeKeys ?? 0}</div>
            <div className="change">keys yang aktif</div>
          </div>
          <div className="stat-card">
            <div className="label">Subscription</div>
            <div className="value" style={{fontSize:20}}>{(user?.subscriptionTier || user?.tier || 'free').charAt(0).toUpperCase() + (user?.subscriptionTier || user?.tier || 'free').slice(1)}</div>
            <div className="change"><a href="#" style={{color:'#4f6af6'}}>Upgrade →</a></div>
          </div>
        </div>

        {/* API Keys */}
        <div className="section">
          <div className="section-header">
            <h2>🔑 API Keys</h2>
            <button className="btn-sm" onClick={() => { setShowModal(true); setNewKey('') }} style={{background:'#4f6af6',color:'white'}}>+ Buat Key Baru</button>
          </div>
          <div className="key-list">
            {keys.length === 0
              ? <p style={{color:'#8b8fa3',textAlign:'center',padding:20}}>Belum ada API key. Buat key pertama Anda di atas.</p>
              : keys.map(k => (
                <div key={k.id} className="key-item">
                  <div className="key-info">
                    <div className="key-name">{k.name || 'API Key'}</div>
                    <div className="key-masked">{k.maskedKey}</div>
                    <div className="key-meta">
                      <span>{k.tier}</span>
                      <span>{k.requestCount || 0} calls</span>
                      <span>Dibuat {fmtDate(k.createdAt)}</span>
                    </div>
                  </div>
                  <div className="key-actions">
                    <button className="btn-sm btn-danger" onClick={() => revokeKey(k.id)}>Revoke</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Quick Links */}
        <div className="section">
          <div className="section-header"><h2>📚 Dokumentasi</h2></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
            {[
              {href:'https://mighan.com/api/docs', icon:'📖', label:'API Documentation', desc:'Swagger UI semua endpoint', external:true},
              {href:'/profile', icon:'👤', label:'Profil Saya', desc:'Edit nama & info akun', external:false},
              {href:'https://ops.mighan.com', icon:'🎮', label:'Enter 3D World', desc:'Buka kantor virtual Mighantect', external:true},
            ].map(l => (
              <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}
                style={{padding:16,background:'#0f0f14',borderRadius:10,textDecoration:'none',color:'#e8eaf0',border:'1px solid #2a2a3a',display:'block'}}>
                <div style={{fontWeight:600,marginBottom:4}}>{l.icon} {l.label}</div>
                <div style={{fontSize:13,color:'#8b8fa3'}}>{l.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      {showModal && (
        <div style={{display:'flex',position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.7)',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#1a1a24',border:'1px solid #2a2a3a',borderRadius:16,padding:32,width:'90%',maxWidth:400}}>
            <h3 style={{marginBottom:16}}>Buat API Key Baru</h3>
            <div className="form-group">
              <label>Nama Key</label>
              <input type="text" placeholder="Contoh: Production Key" value={keyName} onChange={e => setKeyName(e.target.value)}
                style={{width:'100%',padding:'12px 14px',background:'#0f0f14',border:'1px solid #2a2a3a',borderRadius:10,color:'#e8eaf0',fontSize:14}} />
            </div>
            <div className="form-group">
              <label>Tier</label>
              <select value={keyTier} onChange={e => setKeyTier(e.target.value)}
                style={{width:'100%',padding:12,background:'#0f0f14',border:'1px solid #2a2a3a',borderRadius:10,color:'#e8eaf0'}}>
                <option value="free">Free (10 req/min)</option>
                <option value="pro">Pro (100 req/min)</option>
              </select>
            </div>
            {newKey && (
              <div style={{margin:'16px 0',padding:12,background:'#0f0f14',borderRadius:8,fontFamily:'monospace',fontSize:13,wordBreak:'break-all'}}>
                <div style={{color:'#f59e0b',marginBottom:8}}>⚠️ Copy key ini sekarang — tidak akan ditampilkan lagi!</div>
                <div>{newKey}</div>
              </div>
            )}
            <div style={{display:'flex',gap:10,marginTop:20}}>
              {!newKey
                ? <button className="btn btn-primary" onClick={createKey}>Buat</button>
                : <button className="btn btn-primary" onClick={() => { setShowModal(false); setNewKey(''); setKeyName('') }}>Selesai</button>
              }
              <button className="btn" onClick={() => { setShowModal(false); setNewKey('') }} style={{background:'#242430',color:'#e8eaf0'}}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast show">{toast}</div>}
    </div>
  )
}
