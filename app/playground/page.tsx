'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Empty 3D sandbox (no login) — embeds the world-lite builder (drag-drop tiles/objects/buildings).
// Layout uses inline styles (not Tailwind) so the iframe always fills the viewport.
export default function PlaygroundPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden', background: '#0b1020' }}>
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b1020' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎮</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#7cc8ff', margin: 0 }}>Mighan Playground</h1>
          <p style={{ color: '#9fb0d8', fontSize: 13, marginTop: 6 }}>Memuat sandbox 3D…</p>
        </div>
      )}

      <iframe
        src="/world-lite/builder.html"
        title="Mighan Sandbox 3D"
        allow="fullscreen"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block', opacity: isLoading ? 0 : 1, transition: 'opacity .5s' }}
      />

      {!isLoading && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'linear-gradient(90deg,rgba(11,16,32,.92),rgba(11,16,32,.55))', backdropFilter: 'blur(6px)', borderBottom: '1px solid rgba(124,160,255,.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cfe0ff', fontSize: 13, fontWeight: 700 }}>
            <span>🎮</span><span>Playground</span>
            <span style={{ color: '#8595c0', fontWeight: 400 }} className="hide-sm">— bangun dunia 3D-mu, tanpa login</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => router.push('/register')} style={{ padding: '7px 14px', fontSize: 12, fontWeight: 800, background: 'linear-gradient(90deg,#7c5cff,#22d3a6)', color: '#fff', border: 0, borderRadius: 9, cursor: 'pointer' }}>🚀 Daftar Gratis</button>
            <button onClick={() => router.push('/login')} style={{ padding: '7px 14px', fontSize: 12, fontWeight: 700, background: 'transparent', color: '#cfe0ff', border: '1px solid rgba(124,160,255,.4)', borderRadius: 9, cursor: 'pointer' }}>Login</button>
          </div>
        </div>
      )}

      {!isLoading && (
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', background: 'rgba(11,16,32,.9)', backdropFilter: 'blur(6px)', border: '1px solid rgba(124,160,255,.3)', borderRadius: 999, color: '#dbe4ff', fontSize: 13, whiteSpace: 'nowrap' }}>
          <span>💡 Suka? Simpan dunia ini —</span>
          <button onClick={() => router.push('/register')} style={{ padding: '7px 16px', fontSize: 13, fontWeight: 800, background: 'linear-gradient(90deg,#7c5cff,#22d3a6)', color: '#fff', border: 0, borderRadius: 999, cursor: 'pointer' }}>Buat World Kamu →</button>
        </div>
      )}
    </div>
  );
}
