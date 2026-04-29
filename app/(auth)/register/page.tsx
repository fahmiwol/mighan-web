'use client'

import { useState } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [toast, setToast] = useState<{msg: string; type: 'info'|'error'} | null>(null)

  function showToast(msg: string, type: 'info'|'error' = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const r = await fetch(`${API}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName: name }),
    }).then(r => r.json()).catch(() => ({ ok: false }))

    if (r.ok) {
      showToast('Kode OTP dikirim ke email Anda')
      setStep('otp')
    } else {
      showToast(r.error || 'Registrasi gagal', 'error')
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    const r = await fetch(`${API}/api/v1/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    }).then(r => r.json()).catch(() => ({ ok: false }))

    if (r.ok && r.accessToken) {
      localStorage.setItem('mighan_user_token', r.accessToken)
      showToast('Akun berhasil dibuat!')
      setTimeout(() => { window.location.href = '/dashboard' }, 500)
    } else {
      showToast(r.error || 'Kode OTP tidak valid', 'error')
    }
  }

  async function handleResendOtp() {
    const r = await fetch(`${API}/api/v1/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(r => r.json()).catch(() => ({ ok: false }))
    showToast(r.ok ? 'OTP baru dikirim!' : 'Gagal kirim ulang OTP', r.ok ? 'info' : 'error')
  }

  if (step === 'otp') return (
    <div className="auth-card">
      <h1>✉️ Verifikasi Email</h1>
      <p className="subtitle">Masukkan kode OTP 6 digit yang dikirim ke <strong>{email}</strong></p>

      <form onSubmit={handleVerifyOtp}>
        <div className="form-group">
          <label>Kode OTP</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123456"
            required
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            style={{ fontSize: 24, letterSpacing: 8, textAlign: 'center' }}
          />
        </div>
        <button type="submit" className="btn btn-primary">Verifikasi</button>
      </form>

      <p className="auth-footer">
        Tidak dapat kode?{' '}
        <a href="#" onClick={e => { e.preventDefault(); handleResendOtp() }}>Kirim ulang</a>
        {' · '}
        <a href="#" onClick={e => { e.preventDefault(); setStep('form') }}>Kembali</a>
      </p>

      {toast && (
        <div className="toast show" style={{ background: toast.type === 'error' ? '#2a1a1a' : undefined }}>
          {toast.msg}
        </div>
      )}
    </div>
  )

  return (
    <div className="auth-card">
      <h1>🚀 Mulai Gratis</h1>
      <p className="subtitle">Buat akun dan dapatkan 500 API calls gratis</p>

      <button className="btn btn-google" onClick={() => window.location.href = `${API}/api/v1/auth/google`}>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Daftar dengan Google
      </button>

      <div className="divider"><span>atau</span></div>

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Nama</label>
          <input type="text" placeholder="Nama Anda" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="nama@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Minimal 6 karakter" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Buat Akun</button>
      </form>

      <p className="auth-footer">
        Sudah punya akun? <Link href="/login">Masuk</Link>
      </p>

      {toast && (
        <div className="toast show" style={{ background: toast.type === 'error' ? '#2a1a1a' : undefined }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
