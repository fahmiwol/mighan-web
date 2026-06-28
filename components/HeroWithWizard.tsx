'use client'

import { useState } from 'react'
import OnboardingWizard from './OnboardingWizard'

export default function HeroWithWizard() {
  const [showWizard, setShowWizard] = useState(false)

  return (
    <>
      <section id="hero" className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">🚀 Beta — Free during preview</div>
          <h1>Work in a<br />New Dimension</h1>
          <p>Bangun kantor virtual sendiri. Isi dengan AI agent yang bekerja, belajar, dan menghasilkan — 24 jam non-stop.</p>
          <div className="hero-btns">
            <button
              onClick={() => setShowWizard(true)}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--green)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '13px 24px',
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 0 var(--green-deep)',
                transition: 'transform .1s, box-shadow .1s',
                textDecoration: 'none',
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
              Bangun Duniamu →
            </button>
            <a href="/playground" className="btn-secondary">🎮 Playground</a>
          </div>
          <div className="hero-stats">
            <div><b>44+</b><span>AI Agents</span></div>
            <div><b>30+</b><span>Skills</span></div>
            <div><b>24/7</b><span>Autonomy</span></div>
          </div>
        </div>
        <div className="hero-art">
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              maxWidth: 520,
              margin: '0 auto',
              borderRadius: 22,
              overflow: 'hidden',
              background: 'transparent',
              boxShadow: 'none',
            }}
          >
            <iframe
              src="/world-lite/city-hero.html?embed=3&v=bright"
              title="Mighan World — live 3D"
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }}
            />
          </div>
          <div className="iso-label">🏢 Your Virtual Office — live 3D</div>
        </div>
      </section>

      {showWizard && <OnboardingWizard onClose={() => setShowWizard(false)} />}
    </>
  )
}
