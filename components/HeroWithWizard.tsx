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
        <div className="hero-art" aria-hidden="true">
          <div className="iso-scene">
            <div className="tile t1" /><div className="tile t2" />
            <div className="tile t3" /><div className="tile t4" />
            <div className="iso-building b-main"><div className="face top" /><div className="face left" /><div className="face right" /><div className="window w1" /><div className="window w2" /></div>
            <div className="iso-building b-lab"><div className="face top" /><div className="face left" /><div className="face right" /><div className="window w1" /></div>
            <div className="iso-building b-lib"><div className="face top" /><div className="face left" /><div className="face right" /></div>
            <div className="tree tr1"><div className="leaves" /><div className="trunk" /></div>
            <div className="tree tr2"><div className="leaves" /><div className="trunk" /></div>
            <div className="npc n1"><div className="head" /><div className="body" /></div>
            <div className="npc n2"><div className="head" /><div className="body" /></div>
            <div className="npc n3"><div className="head" /><div className="body" /></div>
          </div>
          <div className="iso-label">🏢 Your Virtual Office</div>
        </div>
      </section>

      {showWizard && <OnboardingWizard onClose={() => setShowWizard(false)} />}
    </>
  )
}
