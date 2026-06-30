'use client'

// Provider Hub — BYO (bring-your-own) brain per modalitas.
// Doktrin: Mighan = framework, user bawa API key provider mereka sendiri.
// Tiap modalitas (LLM/image/video/voice/embeddings/search) bisa "pakai default gratis Mighan".

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PortalNav from '../../../components/PortalNav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mighan.com'

interface CatProvider { id: string; label: string; needsKey: boolean; free: boolean | string; keyEnv?: string; models?: string[]; isUrl?: boolean; info?: string; note?: string }
interface CfgEntry { provider: string; model: string; hasKey: boolean; free?: string; updatedAt?: number | null }
type Catalog = Record<string, CatProvider[]>
type Config = Record<string, CfgEntry>

const MODALITY_META: Record<string, { icon: string; label: string; desc: string; color: string }> = {
  llm:        { icon: '🧠', label: 'LLM / Chat',     desc: 'Otak agent — percakapan, reasoning, tool-calling', color: '#4f6af6' },
  image:      { icon: '🎨', label: 'Image Gen',      desc: 'Generasi gambar dari teks', color: '#ec4899' },
  video:      { icon: '🎬', label: 'Video Gen',      desc: 'Teks/gambar → video', color: '#f59e0b' },
  voice:      { icon: '🔊', label: 'Voice / TTS',    desc: 'Text-to-speech & voice cloning', color: '#22c55e' },
  embeddings: { icon: '🧬', label: 'Embeddings',     desc: 'Vektor untuk memory & pencarian semantik', color: '#06b6d4' },
  search:     { icon: '🔍', label: 'Web Search',     desc: 'Pencarian web real-time untuk agent', color: '#8b5cf6' },
}

const C = {
  bg: '#0d0d1a', card: '#111120', border: '#1e1e2e', input: '#0d0d1a',
  text: '#e8eaf0', dim: '#8b8fa3', faint: '#6b7280', accent: '#4f6af6',
}

export default function SettingsPage() {
  const router = useRouter()
  const [catalog, setCatalog] = useState<Catalog>({})
  const [config, setConfig] = useState<Config>({})
  const [modalities, setModalities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  // draft state per modality: { provider, model, key }
  const [draft, setDraft] = useState<Record<string, { provider: string; model: string; key: string }>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }
  function headers() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mighan_user_token') : null
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  }

  const load = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mighan_user_token') : null
    if (!token) { router.push('/login'); return }
    const r = await fetch(`${API}/api/v1/user/providers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).catch(() => null)
    if (!r?.success) { showToast('Gagal memuat Provider Hub'); setLoading(false); return }
    setCatalog(r.data.catalog || {})
    setConfig(r.data.config || {})
    setModalities(r.data.modalities || [])
    // init draft from current config
    const d: Record<string, { provider: string; model: string; key: string }> = {}
    for (const m of (r.data.modalities || [])) {
      const c = r.data.config[m] || { provider: 'mighan', model: '' }
      d[m] = { provider: c.provider, model: c.model || '', key: '' }
    }
    setDraft(d)
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  function setDraftField(m: string, field: 'provider' | 'model' | 'key', value: string) {
    setDraft(prev => {
      const next = { ...prev, [m]: { ...prev[m], [field]: value } }
      // reset model when provider changes
      if (field === 'provider') next[m].model = ''
      return next
    })
  }

  async function save(m: string) {
    const d = draft[m]
    if (!d) return
    setSaving(s => ({ ...s, [m]: true }))
    const body: Record<string, string> = { provider: d.provider }
    if (d.model) body.model = d.model
    if (d.key) body.key = d.key
    const r = await fetch(`${API}/api/v1/user/providers/${m}`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(body)
    }).then(r => r.json()).catch(() => null)
    setSaving(s => ({ ...s, [m]: false }))
    if (r?.success) {
      setConfig(c => ({ ...c, [m]: r.data }))
      setDraft(prev => ({ ...prev, [m]: { ...prev[m], key: '' } }))
      showToast(`${MODALITY_META[m]?.label || m} tersimpan ✓`)
    } else {
      showToast(r?.error || 'Gagal menyimpan')
    }
  }

  async function reset(m: string) {
    setSaving(s => ({ ...s, [m]: true }))
    const r = await fetch(`${API}/api/v1/user/providers/${m}`, { method: 'DELETE', headers: headers() })
      .then(r => r.json()).catch(() => null)
    setSaving(s => ({ ...s, [m]: false }))
    if (r?.success) {
      setConfig(c => ({ ...c, [m]: r.data }))
      setDraft(prev => ({ ...prev, [m]: { provider: 'mighan', model: '', key: '' } }))
      showToast(`${MODALITY_META[m]?.label || m} kembali ke default gratis`)
    }
  }

  if (loading) {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'Nunito, sans-serif' }}>
        <PortalNav />
        <div style={{ maxWidth: 900, margin: '80px auto', textAlign: 'center', color: C.dim }}>Memuat Provider Hub…</div>
      </div>
    )
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'Nunito, sans-serif' }}>
      <PortalNav />

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <Link href="/dashboard" style={{ fontSize: 13, color: C.accent, textDecoration: 'none', fontWeight: 700 }}>← Dashboard</Link>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 4px' }}>⚙️ Provider Hub</h1>
        <p style={{ color: C.dim, fontSize: 14, margin: '0 0 8px', lineHeight: 1.6 }}>
          Bawa "otak" kamu sendiri. Pasang API key provider pilihanmu per kapabilitas — atau pakai default gratis Mighan untuk coba tanpa key.
        </p>
        <div style={{ background: '#1a1a2e', border: '1px solid #4f6af633', borderRadius: 10, padding: '10px 14px', fontSize: 12.5, color: C.dim, marginBottom: 24, lineHeight: 1.6 }}>
          🔒 Key kamu disimpan <b style={{ color: C.text }}>terenkripsi</b> (AES-256) per akun, tidak pernah ditampilkan lagi setelah disimpan. Mighan tidak menjual inference — kamu yang pegang key, kamu yang bayar provider.
        </div>

        {/* Modality cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {modalities.map(m => {
            const meta = MODALITY_META[m] || { icon: '•', label: m, desc: '', color: C.accent }
            const providers = catalog[m] || []
            const cfg = config[m] || { provider: 'mighan', model: '', hasKey: false }
            const d = draft[m] || { provider: 'mighan', model: '', key: '' }
            const selected = providers.find(p => p.id === d.provider)
            const needsKey = selected ? selected.needsKey : false
            const isDefault = d.provider === 'mighan'
            const dirty = d.provider !== cfg.provider || (d.model || '') !== (cfg.model || '') || !!d.key

            return (
              <div key={m} style={{ background: C.card, border: `1px solid ${meta.color}33`, borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 24 }}>{meta.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{meta.label}</div>
                      <div style={{ fontSize: 12, color: C.faint }}>{meta.desc}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
                    color: cfg.hasKey ? '#22c55e' : C.dim,
                    background: cfg.hasKey ? '#22c55e22' : '#2a2a3a', padding: '4px 10px', borderRadius: 20 }}>
                    {cfg.hasKey ? `● ${cfg.provider}` : '○ default gratis'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                  {/* Provider select */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: C.dim, marginBottom: 5 }}>Provider</label>
                    <select value={d.provider} onChange={e => setDraftField(m, 'provider', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: C.input, border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontFamily: 'inherit', fontSize: 13.5 }}>
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.label}{!p.needsKey && p.id !== 'mighan' ? ' (gratis)' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model select (optional) */}
                  {selected?.models && selected.models.length > 0 && (
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: C.dim, marginBottom: 5 }}>Model (opsional)</label>
                      <select value={d.model} onChange={e => setDraftField(m, 'model', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', background: C.input, border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontFamily: 'inherit', fontSize: 13.5 }}>
                        <option value="">Auto / default</option>
                        {selected.models.map(mod => <option key={mod} value={mod}>{mod}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Key input — only when provider needs one */}
                {needsKey && !isDefault && (
                  <div style={{ marginTop: 10 }}>
                    <label style={{ display: 'block', fontSize: 12, color: C.dim, marginBottom: 5 }}>
                      {selected?.isUrl ? 'URL endpoint' : 'API Key'}{cfg.hasKey ? ' — kosongkan untuk pakai key tersimpan' : ''}
                      {selected?.keyEnv ? <span style={{ color: C.faint }}>  ({selected.keyEnv})</span> : null}
                    </label>
                    <input type={selected?.isUrl ? 'text' : 'password'} autoComplete="off"
                      placeholder={cfg.hasKey ? '•••••••• (tersimpan)' : (selected?.isUrl ? 'http://localhost:11434' : 'Tempel API key di sini')}
                      value={d.key} onChange={e => setDraftField(m, 'key', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: C.input, border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontFamily: 'monospace', fontSize: 13, boxSizing: 'border-box' }} />
                    {selected?.note && <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>⚠️ {selected.note}</div>}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center' }}>
                  <button onClick={() => save(m)} disabled={!dirty || saving[m]}
                    style={{ padding: '9px 20px', background: dirty && !saving[m] ? meta.color : '#2a2a3a', color: '#fff', border: 'none', borderRadius: 9, cursor: dirty && !saving[m] ? 'pointer' : 'default', fontFamily: 'inherit', fontWeight: 700, fontSize: 13.5, opacity: dirty && !saving[m] ? 1 : 0.6 }}>
                    {saving[m] ? '…' : 'Simpan'}
                  </button>
                  {cfg.hasKey && (
                    <button onClick={() => reset(m)} disabled={saving[m]}
                      style={{ padding: '9px 16px', background: 'transparent', border: `1px solid ${C.border}`, color: C.dim, borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                      Reset ke default gratis
                    </button>
                  )}
                  {isDefault && <span style={{ fontSize: 12, color: C.faint }}>Pakai default gratis Mighan — tak perlu key.</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
