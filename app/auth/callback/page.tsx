'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CallbackHandler() {
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get('token')
    const error = params.get('error')

    if (error) {
      window.location.href = '/login?error=' + encodeURIComponent(error)
      return
    }

    if (token) {
      localStorage.setItem('mighan_user_token', token)
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/login?error=no_token'
    }
  }, [params])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#e8eaf0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
        <p>Menghubungkan akun...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  )
}
