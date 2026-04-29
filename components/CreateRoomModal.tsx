'use client'

import { useState, useEffect } from 'react'
import { getThemes, type ThemePreset } from '../lib/registry'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

interface CreateRoomModalProps {
  onClose: () => void
  onCreated: () => void
  tier: string
  limits: { maxRooms: number; maxNpcs: number; maxObjects: number }
  roomCount: number
}

export default function CreateRoomModal({ onClose, onCreated, tier, limits, roomCount }: CreateRoomModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [theme, setTheme] = useState('modern')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [themes, setThemes] = useState<Record<string, ThemePreset>>({})

  function getHeaders() {
    const token = localStorage.getItem('mighan_user_token')
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  }

  useEffect(() => {
    getThemes().then(setThemes)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || name.trim().length < 2) {
      setError('Nama room minimal 2 karakter')
      return
    }
    setLoading(true)
    setError('')

    const r = await fetch(`${API}/api/v1/rooms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim() || undefined,
        theme,
      })
    }).then(r => r.json()).catch(() => null)

    setLoading(false)
    if (r?.ok && r.data) {
      onCreated()
    } else {
      setError(r?.error || r?.message || 'Gagal membuat room')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(15,15,20,0.85)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#1a1a24',
        border: '1px solid #2a2a3a',
        borderRadius: 20,
        width: '100%',
        maxWidth: 480,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid #2a2a3a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🏗️ Create New Room</h2>
            <p style={{ color: '#8b8fa3', fontSize: 13 }}>
              Tier <b style={{ color: '#e8eaf0' }}>{tier}</b> — {roomCount} / {limits.maxRooms} room digunakan
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b8fa3',
              fontSize: 20,
              cursor: 'pointer',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {/* Room Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: '#8b8fa3',
            }}>
              Nama Room <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: My Virtual Office"
              maxLength={50}
              style={{
                width: '100%',
                background: '#0f0f14',
                border: '1px solid #2a2a3a',
                borderRadius: 10,
                padding: '11px 14px',
                color: '#e8eaf0',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#4f6af6'}
              onBlur={e => e.currentTarget.style.borderColor = '#2a2a3a'}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: '#8b8fa3',
            }}>
              Deskripsi <span style={{ color: '#8b8fa3', fontWeight: 400 }}>(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Deskripsi singkat tentang room ini..."
              rows={3}
              maxLength={200}
              style={{
                width: '100%',
                background: '#0f0f14',
                border: '1px solid #2a2a3a',
                borderRadius: 10,
                padding: '11px 14px',
                color: '#e8eaf0',
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#4f6af6'}
              onBlur={e => e.currentTarget.style.borderColor = '#2a2a3a'}
            />
          </div>

          {/* Theme */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              marginBottom: 10,
              fontSize: 13,
              fontWeight: 500,
              color: '#8b8fa3',
            }}>
              Tema Room
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.entries(themes).map(([id, t]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  style={{
                    background: theme === id ? '#4f6af620' : '#0f0f14',
                    border: theme === id ? '2px solid #4f6af6' : '1px solid #2a2a3a',
                    borderRadius: 12,
                    padding: '12px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#e8eaf0',
                    transition: 'all .15s',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#8b8fa3' }}>{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tier Limits Preview */}
          <div style={{
            background: '#0f0f14',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8b8fa3', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              Kapasitas Room
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#4f6af6' }}>{limits.maxNpcs}</div>
                <div style={{ fontSize: 11, color: '#8b8fa3' }}>Max NPC</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#8b5cf6' }}>{limits.maxObjects}</div>
                <div style={{ fontSize: 11, color: '#8b8fa3' }}>Max Object</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>{limits.maxRooms}</div>
                <div style={{ fontSize: 11, color: '#8b8fa3' }}>Max Room</div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#ef444420',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 16,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: '#2a2a3a',
                color: '#e8eaf0',
                border: 'none',
                padding: '12px 20px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '⏳ Membuat...' : '🚀 Buat Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
