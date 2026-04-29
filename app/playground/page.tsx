'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlaygroundPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading for UX
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#07080f] overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#07080f]">
          <div className="text-4xl mb-4">🎮</div>
          <h1 className="text-2xl font-bold text-[#00f5ff] mb-2">Mighantect Playground</h1>
          <p className="text-slate-400 text-sm mb-6">Loading 3D world...</p>
          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00f5ff] to-[#06b6d4] animate-pulse rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      )}

      {/* Playground iframe */}
      <iframe
        src="https://ops.mighan.com/playground"
        className={`w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        title="Mighantect 3D Playground"
        allow="fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />

      {/* Top overlay bar */}
      {!isLoading && (
        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#07080f]/90 to-[#07080f]/70 backdrop-blur-sm border-b border-[#00f5ff]/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="text-sm font-semibold text-[#00f5ff]">Playground</span>
            <span className="text-xs text-slate-400 hidden sm:inline">— Coba Mighantect 3D tanpa login</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/register')}
              className="px-3 py-1.5 text-xs font-semibold bg-[#00f5ff] text-[#07080f] rounded hover:bg-[#00d4e0] transition-colors"
            >
              🚀 Sign Up Free
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-3 py-1.5 text-xs font-semibold border border-[#00f5ff]/40 text-[#00f5ff] rounded hover:bg-[#00f5ff]/10 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      {!isLoading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#07080f]/90 backdrop-blur-sm border border-[#00f5ff]/30 rounded-full">
            <span className="text-sm text-slate-300">💡 Suka pengalaman ini?</span>
            <button
              onClick={() => router.push('/register')}
              className="px-4 py-1.5 text-sm font-bold bg-gradient-to-r from-[#00f5ff] to-[#06b6d4] text-[#07080f] rounded-full hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all"
            >
              Buat World Kamu →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
