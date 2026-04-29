'use client'

import Link from 'next/link'
import PortalNav from '../../../components/PortalNav'
import '../../(auth)/portal.css'

const PLANS = [
  {
    name: 'Free',
    price: 0,
    currency: 'IDR',
    period: 'Selamanya',
    color: '#8b8fa3',
    features: [
      '1 Virtual Room',
      '3 AI Agent (NPC)',
      '10 Objects per room',
      '500 API calls / bulan',
      'Tema: Modern',
    ],
    cta: 'Plan Aktif',
    disabled: true,
  },
  {
    name: 'Pro',
    price: 99000,
    currency: 'IDR',
    period: 'per bulan',
    color: '#4f6af6',
    badge: '🔥 Populer',
    features: [
      '5 Virtual Rooms',
      '10 AI Agent per room',
      '50 Objects per room',
      '10.000 API calls / bulan',
      'Semua tema',
      'Subdomain custom',
      'Priority support',
    ],
    cta: 'Upgrade ke Pro',
    disabled: false,
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 499000,
    currency: 'IDR',
    period: 'per bulan',
    color: '#f59e0b',
    features: [
      'Unlimited Rooms',
      'Unlimited Agents',
      'Unlimited Objects',
      'Unlimited API calls',
      'Custom domain',
      'White label',
      'Dedicated support',
      'SLA 99.9%',
    ],
    cta: 'Hubungi Kami',
    disabled: false,
  },
]

function fmt(n: number) {
  return n.toLocaleString('id-ID')
}

export default function WalletPage() {
  return (
    <div style={{ background: '#0f0f14', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <PortalNav />
      <div className="portal-container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>💳 Upgrade Plan</h1>
            <p style={{ color: '#8b8fa3', fontSize: 14, marginTop: 4 }}>Pilih plan yang sesuai untuk berkembang lebih jauh</p>
          </div>
          <Link href="/dashboard/rooms" className="btn-sm" style={{ background: '#242430', color: '#e8eaf0', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            ← My Rooms
          </Link>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 40 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              background: plan.highlight ? 'linear-gradient(135deg, #1a1a2e, #1e1e35)' : '#1a1a24',
              border: `2px solid ${plan.highlight ? '#4f6af6' : '#2a2a3a'}`,
              borderRadius: 20,
              padding: 28,
              position: 'relative',
              transition: 'transform .15s',
            }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: '#4f6af6', color: '#fff', fontSize: 12, fontWeight: 700,
                  padding: '4px 14px', borderRadius: 20,
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: plan.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: '#e8eaf0' }}>
                    {plan.price === 0 ? 'Gratis' : `Rp ${fmt(plan.price)}`}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#8b8fa3', marginTop: 2 }}>{plan.period}</div>
              </div>

              {/* Features */}
              <div style={{ borderTop: '1px solid #2a2a3a', paddingTop: 20, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ color: plan.color, fontSize: 14, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: '#c8cad8' }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                disabled={plan.disabled}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: plan.disabled ? 'default' : 'pointer',
                  background: plan.disabled ? '#2a2a3a' : plan.highlight ? '#4f6af6' : '#242430',
                  color: plan.disabled ? '#8b8fa3' : '#fff',
                  outline: plan.disabled ? '1px solid #3a3a4a' : plan.highlight ? 'none' : '1px solid #4f6af6',
                }}
                onClick={() => {
                  if (!plan.disabled && plan.name === 'Enterprise') {
                    window.open('mailto:hello@mighan.com?subject=Enterprise Plan', '_blank')
                  }
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div style={{
          background: '#1a1a24',
          border: '1px solid #2a2a3a',
          borderRadius: 16,
          padding: 28,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
          <h3 style={{ marginBottom: 8 }}>Pembayaran Segera Hadir</h3>
          <p style={{ color: '#8b8fa3', fontSize: 14, maxWidth: 500, margin: '0 auto 16px' }}>
            Sistem billing sedang dalam pengembangan. Untuk upgrade sekarang, hubungi kami langsung melalui email atau WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a
              href="mailto:hello@mighan.com?subject=Upgrade Plan"
              style={{
                padding: '10px 20px', background: '#4f6af6', color: '#fff',
                borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600,
              }}
            >
              📧 Email Kami
            </a>
            <Link
              href="/dashboard"
              style={{
                padding: '10px 20px', background: '#242430', color: '#e8eaf0',
                borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600,
              }}
            >
              ← Kembali
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
