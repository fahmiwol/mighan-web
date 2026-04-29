'use client'

import { useEffect } from 'react'

export default function LandingScripts() {
  useEffect(() => {
    const s = document.createElement('script')
    s.src = '/main.js'
    s.defer = true
    document.body.appendChild(s)

    const gt = document.createElement('script')
    gt.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    gt.defer = true
    document.body.appendChild(gt)

    return () => {
      document.body.removeChild(s)
    }
  }, [])
  return null
}
