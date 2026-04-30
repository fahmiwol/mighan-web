'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PortalNav from '../../../components/PortalNav'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://mighan.com'

interface Balance { ixc: number; perak: number; emas: number; perunggu: number }
interface Transaction {
  id: string; type: string; amountIxc: number; status: string
  createdAt: string; description?: string; roomId?: string
}

const PLANS = [
  {
    name: 'Free', priceIDR: 0, period: 'Selamanya', color: '#8b8fa3', ixBonus: 0,
    features: ['1 Virtual Room', '3 AI NPC per room', '10 Objects', '500 chat/bulan'],
    cta: 'Plan Aktif', disabled: true,
  },
  {
    name: 'Starter', priceIDR: 49000, period: 'per bulan', color: '#22c55e', ixBonus: 500,
    features: ['3 Virtual Rooms', '5 AI NPC per room', '30 Objects', '3.000 chat/bulan', 'Bonus 500 IX/bulan'],
    cta: 'Pilih Starter', disabled: false,
  },
  {
    name: 'Pro', priceIDR: 99000, period: 'per bulan', color: '#4f6af6', ixBonus: 1500,
    badge: '🔥 Populer',
    features: ['5 Virtual Rooms', '10 AI NPC per room', '50 Objects', '10.000 chat/bulan', 'Bonus 1.500 IX/bulan', 'Custom subdomain'],
    cta: 'Upgrade ke Pro', disabled: false, highlight: true,
  },
  {
    name: 'Enterprise', priceIDR: 499000, period: 'per bulan', color: '#f59e0b', ixBonus: 10000,
    features: ['Unlimited Rooms', 'Unlimited NPC', 'Unlimited Objects', 'Unlimited chat', '10.000 IX/bulan', 'Custom domain + White label'],
    cta: 'Hubungi Kami', disabled: false,
  },
]

const TX_COLOR: Record<string, string> = {
  topup: '#22c55e', purchase: '#f97316', hire: '#4f6af6', refund: '#8b5cf6', spend: '#ef4444'
}
const TX_ICON: Record<string, string> = {
  topup: '⬆️', purchase: '🛒', hire: '🤖', refund: '↩️', spend: '💸'
}

function fmt(n: number) { return n.toLocaleString('id-ID') }
function fmtDate(s: string) {
  const d = new Date(s)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function WalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<Balance | null>(null)
  const [connected, setConnected] = useState(false)
  const [txs, setTxs] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [topupQty, setTopupQty] = useState(1000)
  const [topping, setTopping] = useState(false)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState<'wallet' | 'plans'>('wallet')

  function getHeaders() {
    const t = localStorage.getItem('mighan_user_token')
    return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) }
  }
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3500) }

  useEffect(() => {
    const t = localStorage.getItem('mighan_user_token')
    if (!t) { router.push('/login'); return }
    Promise.all([
      fetch(`${API}/api/v1/wallet/balance`, { headers: { Authorization: `Bearer ${t}` } }).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/v1/wallet/history`, { headers: { Authorization: `Bearer ${t}` } }).then(r => r.json()).catch(() => null),
    ]).then(([balRes, txRes]) => {
      if (balRes?.ok) { setBalance(balRes.balance); setConnected(balRes.connected) }
      else setBalance({ ixc: 0, perak: 0, emas: 0, perunggu: 0 })
      if (txRes?.ok) setTxs(txRes.data || [])
      setLoading(false)
    })
  }, [router])

  async function handleTopup() {
    if (topupQty <= 0) return
    setTopping(true)
    try {
      const t = localStorage.getItem('mighan_user_token') || ''
      const r = await fetch(`${API}/api/v1/wallet/topup`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ qty: topupQty })
      }).then(r => r.json())
      if (r.ok || r.success) showToast(`Top-up ${topupQty} IX berhasil diminta!`)
      else showToast(r.error || r.message || 'Hubungi admin untuk top-up')
    } finally { setTopping(false) }
  }

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'Nunito, sans-serif' }}>
      <PortalNav />

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>

        {/* Header + tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>💳 Wallet & Billing</h1>
            <p style={{ color: '#8b8fa3', fontSize: 14, margin: '4px 0 0' }}>Kelola IX token dan pilih plan</p>
          </div>
          <div style={{ display: 'flex', background: '#111120', borderRadius: 10, padding: 3 }}>
            {(['wallet', 'plans'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                background: activeTab === t ? '#4f6af6' : 'transparent',
                color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8,
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14
              }}>
                {t === 'wallet' ? '🪙 Wallet' : '📦 Plans'}
              </button>
            ))}
          </div>
        </div>

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <div>
            {/* Balance Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              {/* IX Balance — main */}
              <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #1e2040)', border: '1px solid #4f6af666', borderRadius: 16, padding: '20px 24px', gridColumn: 'span 2' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8b8fa3', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  IX Balance {!connected && <span style={{ color: '#f59e0b', marginLeft: 8 }}>• Ixonomic tidak terhubung</span>}
                </div>
                {loading ? (
                  <div style={{ height: 44, background: '#2a2a3a', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
                ) : (
                  <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1 }}>
                    <span style={{ color: '#c8b6ff' }}>◈</span> {fmt(balance?.ixc || 0)} <span style={{ fontSize: 16, color: '#8b8fa3', fontWeight: 600 }}>IX</span>
                  </div>
                )}
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>≈ Rp {fmt((balance?.ixc || 0) * 10)} · 1 IX = Rp 10</div>
              </div>

              {/* Perak */}
              <div style={{ background: '#111120', border: '1px solid #2a2a3a', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ fontSize: 12, color: '#8b8fa3', fontWeight: 600, marginBottom: 8 }}>🥈 Perak</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#94a3b8' }}>{fmt(balance?.perak || 0)}</div>
              </div>

              {/* Emas */}
              <div style={{ background: '#111120', border: '1px solid #2a2a3a', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ fontSize: 12, color: '#8b8fa3', fontWeight: 600, marginBottom: 8 }}>🥇 Emas</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{fmt(balance?.emas || 0)}</div>
              </div>
            </div>

            {/* Top-up + Quick amounts */}
            <div style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24, marginBottom: 28 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>⬆️ Top-Up IX</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[500, 1000, 2500, 5000, 10000].map(q => (
                  <button key={q} onClick={() => setTopupQty(q)} style={{
                    padding: '7px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    background: topupQty === q ? '#4f6af6' : '#1a1a28', color: topupQty === q ? '#fff' : '#8b8fa3',
                    border: `1px solid ${topupQty === q ? '#4f6af6' : '#2a2a3a'}`
                  }}>
                    {fmt(q)} IX
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="number" value={topupQty} onChange={e => setTopupQty(parseInt(e.target.value) || 0)} min={100}
                  style={{ flex: 1, maxWidth: 180, background: '#1a1a28', border: '1px solid #2a2a3a', color: '#e8eaf0', padding: '10px 14px', borderRadius: 9, fontFamily: 'inherit', fontSize: 14 }}
                />
                <span style={{ color: '#8b8fa3', fontSize: 13 }}>≈ Rp {fmt(topupQty * 10)}</span>
                <button onClick={handleTopup} disabled={topping || topupQty <= 0} style={{
                  padding: '10px 24px', background: '#4f6af6', color: '#fff', border: 'none', borderRadius: 9,
                  cursor: topping ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14
                }}>
                  {topping ? 'Memproses...' : 'Top-Up'}
                </button>
              </div>
              <p style={{ color: '#6b7280', fontSize: 12, margin: '10px 0 0' }}>💡 Top-up akan diproses dalam 1-24 jam kerja. Hubungi admin untuk proses lebih cepat.</p>
            </div>

            {/* Transaction History */}
            <div style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>📜 Riwayat Transaksi</h3>
              {loading ? (
                <div style={{ color: '#8b8fa3', textAlign: 'center', padding: '32px 0', fontSize: 14 }}>Memuat...</div>
              ) : txs.length === 0 ? (
                <div style={{ color: '#6b7280', textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  <div style={{ fontSize: 14 }}>Belum ada transaksi</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {txs.map(tx => (
                    <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: '#0d0d1a' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: (TX_COLOR[tx.type] || '#8b8fa3') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {TX_ICON[tx.type] || '💫'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#e8eaf0' }}>{tx.description || tx.type}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>{fmtDate(tx.createdAt)}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: tx.amountIxc >= 0 ? '#22c55e' : '#ef4444' }}>
                          {tx.amountIxc >= 0 ? '+' : ''}{fmt(tx.amountIxc)} IX
                        </div>
                        <div style={{ fontSize: 11, color: tx.status === 'completed' ? '#22c55e' : '#f59e0b' }}>{tx.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PLANS TAB */}
        {activeTab === 'plans' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 32 }}>
              {PLANS.map(plan => (
                <div key={plan.name} style={{
                  background: plan.highlight ? 'linear-gradient(135deg, #1a1a2e, #1e2040)' : '#111120',
                  border: `2px solid ${plan.highlight ? '#4f6af6' : '#1e1e2e'}`,
                  borderRadius: 18, padding: 24, position: 'relative',
                }}>
                  {plan.badge && (
                    <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#4f6af6', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 20 }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 700, color: plan.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{plan.name}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 2 }}>
                    {plan.priceIDR === 0 ? 'Gratis' : `Rp ${fmt(plan.priceIDR)}`}
                  </div>
                  <div style={{ fontSize: 12, color: '#8b8fa3', marginBottom: 16 }}>{plan.period}</div>
                  {plan.ixBonus > 0 && (
                    <div style={{ background: '#c8b6ff22', border: '1px solid #c8b6ff44', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700, color: '#c8b6ff', marginBottom: 16, display: 'inline-block' }}>
                      ◈ +{fmt(plan.ixBonus)} IX/bulan
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid #2a2a3a', paddingTop: 16, marginBottom: 20 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: plan.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: 13, color: '#c8cad8', lineHeight: 1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    disabled={plan.disabled}
                    onClick={() => {
                      if (!plan.disabled && plan.name === 'Enterprise') window.open('mailto:hello@mighan.com?subject=Enterprise Plan', '_blank')
                      else if (!plan.disabled) showToast('Segera hadir! Hubungi admin untuk upgrade manual.')
                    }}
                    style={{
                      width: '100%', padding: '11px 0', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none',
                      cursor: plan.disabled ? 'default' : 'pointer', fontFamily: 'inherit',
                      background: plan.disabled ? '#2a2a3a' : plan.highlight ? '#4f6af6' : '#1a1a28',
                      color: plan.disabled ? '#6b7280' : '#fff',
                      outline: (!plan.disabled && !plan.highlight) ? '1px solid #4f6af6' : 'none',
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* IX Store */}
            <div style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800 }}>◈ Tentang IX Token</h3>
              <p style={{ color: '#8b8fa3', fontSize: 13, margin: '0 0 16px', lineHeight: 1.6 }}>
                IX adalah token internal Mighantect. Digunakan untuk hire NPC, beli objects, dan akses fitur premium. 1 IX = Rp 10.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('wallet')} style={{ padding: '10px 20px', background: '#c8b6ff22', border: '1px solid #c8b6ff44', color: '#c8b6ff', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
                  ⬆️ Top-Up IX
                </button>
                <a href="https://ixonomic.com" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', background: '#1a1a28', border: '1px solid #2a2a3a', color: '#e8eaf0', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                  🌐 Ixonomic.com
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
