'use client'

import { useState, useEffect } from 'react'

const STEPS = [
  {
    title: 'Selamat Datang di Mighantect',
    subtitle: 'Kantor virtualmu dimulai dari sini',
    body: 'Bangun dunia 3D pribadi, hire AI agents, dan otomasi workflow — semua tanpa coding.',
    icon: '🏢',
    color: '#3b6df0',
  },
  {
    title: 'Hire AI Agents',
    subtitle: 'Tim virtual yang bekerja 24/7',
    body: 'Pilih dari 44+ agent template atau bikin sendiri. Mereka riset, bikin konten, coding, dan jualan — non-stop.',
    icon: '🤖',
    color: '#8b5cf6',
  },
  {
    title: 'Bangun & Kustomisasi',
    subtitle: 'Drag, drop, dan desain',
    body: 'Atur ruangan, pasang furniture, atur lighting, dan bangun workflow otomatis dengan visual SOP editor.',
    icon: '🏗️',
    color: '#3ecf6a',
  },
  {
    title: 'Siap Memulai?',
    subtitle: 'Gratis selama preview',
    body: 'Daftar sekarang dan dapatkan room starter gratis — 1 room, 3 NPC, 10 object. Upgrade kapan saja.',
    icon: '🚀',
    color: '#ff9f59',
  },
]

export default function OnboardingWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
  }
  const prev = () => {
    if (step > 0) setStep(s => s - 1)
  }
  const skip = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }
  const goRegister = () => {
    window.location.href = '/register'
  }
  const goLogin = () => {
    window.location.href = '/login'
  }

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div
      className="wiz-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: visible ? 'rgba(26,31,46,0.65)' : 'rgba(26,31,46,0)',
        backdropFilter: visible ? 'blur(8px)' : 'blur(0px)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.35s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) skip()
      }}
    >
      <div
        className="wiz-card"
        style={{
          background: '#fff',
          borderRadius: 24,
          width: '100%',
          maxWidth: 480,
          padding: '40px 36px 32px',
          boxShadow: '0 24px 60px rgba(26,31,46,0.18)',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(.34,1.56,.64,1)',
          position: 'relative',
        }}
      >
        {/* Skip */}
        <button
          onClick={skip}
          className="wiz-skip"
          style={{
            position: 'absolute',
            top: 16,
            right: 20,
            fontSize: 13,
            fontWeight: 700,
            color: '#8a92a6',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 8,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f4f5f7')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          Lewati
        </button>

        {/* Step indicator */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 28,
          }}
        >
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 28 : 10,
                height: 10,
                borderRadius: 5,
                background: i === step ? current.color : i < step ? current.color : '#e7eaf0',
                transition: 'all 0.3s ease',
                opacity: i > step ? 0.5 : 1,
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: `${current.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            margin: '0 auto 20px',
          }}
        >
          {current.icon}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: 6,
            color: '#1a1f2e',
            lineHeight: 1.25,
          }}
        >
          {current.title}
        </h2>
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            textAlign: 'center',
            color: current.color,
            marginBottom: 14,
          }}
        >
          {current.subtitle}
        </p>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            textAlign: 'center',
            color: '#4b5365',
            marginBottom: 28,
            fontWeight: 600,
          }}
        >
          {current.body}
        </p>

        {/* CTA Area */}
        {isLast ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={goRegister}
              className="btn-primary"
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 20px',
                borderRadius: 14,
                background: 'var(--green)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 0 var(--green-deep)',
                transition: 'transform .1s, box-shadow .1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 0 var(--green-deep)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 0 var(--green-deep)'
              }}
            >
              🚀 Daftar Gratis
            </button>
            <button
              onClick={goLogin}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 20px',
                borderRadius: 14,
                background: '#f4f5f7',
                color: '#4b5365',
                fontSize: 14,
                fontWeight: 700,
                border: '2px solid #e7eaf0',
                cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.borderColor = '#c7cdd9'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f4f5f7'
                e.currentTarget.style.borderColor = '#e7eaf0'
              }}
            >
              Sudah punya akun? Masuk →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            {step > 0 && (
              <button
                onClick={prev}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: '#f4f5f7',
                  color: '#4b5365',
                  fontSize: 14,
                  fontWeight: 700,
                  border: '2px solid #e7eaf0',
                  cursor: 'pointer',
                }}
              >
                ← Kembali
              </button>
            )}
            <button
              onClick={next}
              style={{
                flex: step > 0 ? 1 : 'none',
                width: step > 0 ? 'auto' : '100%',
                padding: '12px 24px',
                borderRadius: 14,
                background: current.color,
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 4px 0 ${current.color}88`,
                transition: 'transform .1s, box-shadow .1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Lanjut →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
