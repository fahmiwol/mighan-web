import { AuthProvider } from '@/components/AuthProvider'
import Sidebar from '@/components/Sidebar'
import LandingScripts from '@/components/LandingScripts'
import HeroWithWizard from '@/components/HeroWithWizard'

export default function Home() {
  return (
    <AuthProvider>
      {/* Mobile top header */}
      <header className="mobile-top">
        <button className="m-menu" id="mMenu" aria-label="Menu">☰</button>
        <div className="m-logo">
          <div className="logo-mark">
            <span className="pix pix-1" /><span className="pix pix-2" />
            <span className="pix pix-3" /><span className="pix pix-4" />
          </div>
          <span>Mighantect</span>
        </div>
        <button className="m-avatar" aria-label="Profile">F</button>
      </header>

      <div className="drawer-overlay" id="drawerOverlay" />

      <div className="app">
        <Sidebar />

        <main className="main">
          {/* URL bar mock */}
          <div className="top-bar">
            <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            <div className="url-bar">mighantect.com</div>
          </div>

          {/* HERO with Onboarding Wizard */}
          <HeroWithWizard />

          {/* DEMO */}
          <section id="demo" className="block">
            <div className="block-head">
              <h2>Lihat Dunianya Bekerja</h2>
              <a href="#build" className="see-all">Coba Langsung →</a>
            </div>
            <div className="demo-frame">
              <div className="demo-window">
                <div className="demo-bar">
                  <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                  <span className="demo-title">mighantect.com/world</span>
                </div>
                <div className="demo-scene">
                  <div className="demo-scene-inner">
                    <div className="iso-scene demo-iso">
                      <div className="tile t1" style={{background:'#8be4a9'}} /><div className="tile t2" style={{background:'#9aeab3'}} />
                      <div className="tile t3" style={{background:'#9aeab3'}} /><div className="tile t4" style={{background:'#8be4a9'}} />
                      <div className="iso-building b-main"><div className="face top" /><div className="face left" /><div className="face right" /><div className="window w1" /><div className="window w2" /></div>
                      <div className="iso-building b-lab"><div className="face top" /><div className="face left" /><div className="face right" /></div>
                      <div className="npc n1"><div className="head" /><div className="body" /></div>
                      <div className="npc n2"><div className="head" /><div className="body" /></div>
                    </div>
                  </div>
                  <div className="demo-chat">
                    <div className="chat-bubble"><b>Sari</b><br />Lagi riset trending topic untuk campaign minggu depan...</div>
                    <div className="chat-bubble chat-user"><b>Kamu</b><br />Include TikTok ya</div>
                    <div className="chat-typing">Sari sedang mengetik<span>.</span><span>.</span><span>.</span></div>
                  </div>
                </div>
              </div>
              <div className="demo-features">
                <div className="demo-feat"><span className="feat-ico">🎬</span><span>Kamera sinematik</span></div>
                <div className="demo-feat"><span className="feat-ico">💬</span><span>Chat real-time dengan agent</span></div>
                <div className="demo-feat"><span className="feat-ico">🎭</span><span>Emosi NPC dinamis</span></div>
                <div className="demo-feat"><span className="feat-ico">🌤️</span><span>Siang-malam + cuaca</span></div>
              </div>
            </div>
          </section>

          {/* BUILD */}
          <section id="build" className="block">
            <div className="block-head"><h2>Bangun Punyamu Sendiri</h2></div>
            <div className="build-grid">
              <a href="#agents" className="build-card build-1">
                <div className="build-num">01</div><div className="build-ico">👥</div>
                <h3>Pilih Agent</h3><p>Hire dari 44+ template atau bikin agent sendiri dengan persona custom.</p>
                <span className="build-link">Meet the Agents →</span>
              </a>
              <a href="#skills" className="build-card build-2">
                <div className="build-num">02</div><div className="build-ico">🧩</div>
                <h3>Pasang Skills</h3><p>Kasih tools, plugin, atau custom API function ke agentmu.</p>
                <span className="build-link">Browse Skills →</span>
              </a>
              <a href="#builder" className="build-card build-3">
                <div className="build-num">03</div><div className="build-ico">🏗️</div>
                <h3>Desain Ruangan</h3><p>Room Builder drag-and-drop. Objek bisa hiasan atau punya fungsi.</p>
                <span className="build-link">Try Builder →</span>
              </a>
              <a href="#usecases" className="build-card build-4">
                <div className="build-num">04</div><div className="build-ico">⚡</div>
                <h3>Jalankan</h3><p>Agent bekerja otomatis. Kamu tinggal tuangkan brief.</p>
                <span className="build-link">See Use Cases →</span>
              </a>
            </div>
          </section>

          {/* AGENTS */}
          <section id="agents" className="block">
            <div className="block-head">
              <div><span className="section-tag">Template · Meet the Agents</span><h2>Pilih Timmu</h2></div>
              <a href="#" className="see-all">All 44 agents →</a>
            </div>
            <div className="id-card-row" id="idCardRow" />
          </section>

          {/* ABOUT */}
          <section id="about" className="block">
            <div className="block-head">
              <div><span className="section-tag">Tentang</span><h2>Apa itu Mighantect?</h2></div>
              <a href="/about" className="see-all">Selengkapnya →</a>
            </div>
            <div className="about-grid">
              <div className="about-hero">
                <div className="about-emoji">🌍</div>
                <h3>Kantor 3D untuk AI-mu</h3>
                <p>Mighantect adalah dunia isometrik tempat kamu menaruh AI agent. Mereka punya ruangan, wajah, dan SOP. Kamu kasih brief, mereka jalanin.</p>
              </div>
              <div className="about-stat">
                <div><b>5</b><span>Gedung</span></div>
                <div><b>26+</b><span>Ruangan</span></div>
                <div><b>6</b><span>LLM Provider</span></div>
                <div><b>∞</b><span>Ekspansi</span></div>
              </div>
            </div>
          </section>

          {/* SKILLS */}
          <section id="skills" className="block">
            <div className="block-head">
              <div><span className="section-tag">Template · Skills, Tools &amp; Plugin</span><h2>Senjata untuk Agentmu</h2></div>
              <a href="#plugins" className="see-all">Custom API →</a>
            </div>
            <div className="chip-filter">
              <button className="chip active" data-cat="all">Semua</button>
              <button className="chip" data-cat="agent">🧠 Agent</button>
              <button className="chip" data-cat="media">🎨 Media</button>
              <button className="chip" data-cat="workflow">⚡ Workflow</button>
              <button className="chip" data-cat="api">🔗 API</button>
              <button className="chip" data-cat="connect">🌐 Connect</button>
            </div>
            <div className="skill-grid" id="skillGrid" />
            <div id="plugins" className="plugin-callout">
              <div className="plugin-ico">⚙️</div>
              <div className="plugin-body">
                <h3>Punya API/fungsi sendiri? Pasang sebagai plugin.</h3>
                <p>Kalau ada layanan yang belum ada di list, tinggal tulis JavaScript function — agent bisa panggil langsung.</p>
                <div className="plugin-tags">
                  <span className="tag">JS Function</span><span className="tag">REST Webhook</span>
                  <span className="tag">Schema JSON</span><span className="tag">Auto-docs</span>
                </div>
                <a href="#kontak" className="btn-ghost small">📖 Baca Dokumentasi</a>
              </div>
            </div>
          </section>

          {/* BUILDER */}
          <section id="builder" className="block">
            <div className="block-head">
              <div><span className="section-tag">Template · Room Builder</span><h2>Room Builder &amp; Decoration</h2></div>
              <a href="/builder" className="see-all">Selengkapnya →</a>
            </div>
            <div className="builder-grid">
              <div className="builder-text">
                <h3>Visual Builder Mode</h3>
                <p>Masuk mode builder, grid muncul. Tarik-taruh ruangan, pintu, furniture. Save, publish — langsung jadi bagian dunia agent.</p>
                <ul className="builder-list">
                  <li>✅ Grid-snap drag &amp; drop</li>
                  <li>✅ 200+ preset object library</li>
                  <li>✅ Live preview sebelum publish</li>
                  <li>✅ Template room siap pakai</li>
                </ul>
              </div>
              <div className="builder-preview">
                <div className="builder-grid-bg">
                  <div className="placed sofa-p" /><div className="placed desk-p" />
                  <div className="placed plant-p" /><div className="placed panel-p">API</div>
                  <div className="cursor-hint">✋</div>
                </div>
                <div className="builder-tools">
                  <button>🪑</button><button>🌿</button><button className="active">🔌</button><button>🖼️</button>
                </div>
              </div>
            </div>
            <div className="obj-types">
              <h3>Tipe Objek</h3>
              <div className="obj-row">
                <div className="obj-card obj-deco"><div className="obj-img">🌿</div><span className="obj-tag deco">Decoration</span><h4>Hiasan</h4><p>Bikin ruangan hidup. Plant, painting, sofa — cuma visual, tidak eksekusi apa-apa.</p></div>
                <div className="obj-card obj-func"><div className="obj-img">🔌</div><span className="obj-tag func">Functional</span><h4>Berfungsi</h4><p>Object yang bisa di-klik &amp; panggil modul. Misal <b>API Panel</b> buka konfigurasi.</p></div>
                <div className="obj-card obj-custom"><div className="obj-img">✨</div><span className="obj-tag custom">Custom</span><h4>Dibuat Sendiri</h4><p>Assign function JS ke object biasa. Klik lemari → backup folder.</p></div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section id="features" className="block">
            <div className="block-head">
              <div><span className="section-tag">Custom SOP Workflow</span><h2>Visual Scripting: Rakit Logika Agent</h2></div>
              <a href="/features" className="see-all">Selengkapnya →</a>
            </div>
            <div className="sop-showcase">
              <div className="sop-canvas">
                <div className="sop-node n-trigger"><span className="node-ico">⚡</span><div><b>Trigger</b><small>Jadwal: 06:00</small></div></div>
                <svg className="sop-line l1" viewBox="0 0 100 40"><path d="M0 20 L100 20" stroke="#3b6df0" strokeWidth="2" fill="none" strokeDasharray="4,4"/></svg>
                <div className="sop-node n-research"><span className="node-ico">🔍</span><div><b>Riset Trending</b><small>Agent: Iris</small></div></div>
                <svg className="sop-line l2" viewBox="0 0 100 40"><path d="M0 20 L100 20" stroke="#3b6df0" strokeWidth="2" fill="none" strokeDasharray="4,4"/></svg>
                <div className="sop-node n-write"><span className="node-ico">✍️</span><div><b>Tulis Caption</b><small>Agent: Kalinda</small></div></div>
                <svg className="sop-line l3" viewBox="0 0 100 40"><path d="M0 20 L100 20" stroke="#3b6df0" strokeWidth="2" fill="none" strokeDasharray="4,4"/></svg>
                <div className="sop-node n-post"><span className="node-ico">📤</span><div><b>Post IG + TikTok</b><small>Agent: Rina</small></div></div>
              </div>
              <p className="sop-caption">Drag-drop node. Agent akan jalanin sesuai flow yang kamu bikin — tanpa coding.</p>
            </div>
          </section>

          {/* COINOMICS */}
          <section id="coinomics" className="block">
            <div className="block-head">
              <div><span className="section-tag">Coinomics</span><h2>Dua Koin, Dua Fungsi</h2></div>
              <a href="/coinomics" className="see-all">Selengkapnya →</a>
            </div>
            <div className="coin-split">
              <article className="coin-big c-gold">
                <div className="coin-big-head"><div className="coin-big-ico">🏆</div><div><h3>Gold Coin</h3><div className="coin-big-sub">Mata uang user → Mighan</div></div></div>
                <p className="coin-intro">Kamu isi Gold sekali, pakai selamanya di ekosistem Mighan.</p>
                <ul className="coin-use">
                  <li>💎 <b>Beli tools premium</b> &amp; agent template</li>
                  <li>🏠 <b>Upgrade world</b>: slot gedung, ruangan, agent</li>
                  <li>📦 <b>Storage &amp; compute</b> (hosting ringan)</li>
                  <li>🎓 <b>Unlock course</b> &amp; starter pack</li>
                </ul>
                <div className="coin-footer">
                  <div className="coin-price"><b>1 Gold ≈ Rp 100</b><small>Top-up: bank, e-wallet, kartu</small></div>
                  <a href="#" className="btn-chip">Top up Gold →</a>
                </div>
              </article>
              <article className="coin-big c-silver">
                <div className="coin-big-head"><div className="coin-big-ico">🪙</div><div><h3>Silver Coin</h3><div className="coin-big-sub">Dompet belanja untuk Agent</div></div></div>
                <p className="coin-intro">Agent butuh belanja API. Mereka pakai Silver — bukan kartu kreditmu.</p>
                <ul className="coin-use">
                  <li>🔒 <b>Isolasi kartu kredit</b> user</li>
                  <li>📊 <b>Audit trail</b> tiap pengeluaran tercatat</li>
                  <li>⚖️ <b>Budget control</b> per-agent, per-hari</li>
                  <li>✋ <b>Approval gate</b>: &gt; limit butuh konfirmasi</li>
                </ul>
                <div className="coin-footer">
                  <div className="coin-price"><b>Auto-convert dari Gold</b><small>1 Gold = 10 Silver saat dibutuhkan</small></div>
                  <a href="#" className="btn-chip">Lihat Ledger →</a>
                </div>
              </article>
            </div>
            <div className="coin-flow">
              <div className="flow-step"><div className="flow-ico">👤</div><b>Kamu</b><small>top-up Gold</small></div>
              <div className="flow-arrow">→</div>
              <div className="flow-step"><div className="flow-ico">🏦</div><b>Mighan Wallet</b><small>simpan Gold</small></div>
              <div className="flow-arrow">→</div>
              <div className="flow-step"><div className="flow-ico">🤖</div><b>Agent</b><small>convert ke Silver</small></div>
              <div className="flow-arrow">→</div>
              <div className="flow-step"><div className="flow-ico">🌐</div><b>API External</b><small>OpenAI, dll</small></div>
            </div>
          </section>

          {/* USE CASES */}
          <section id="usecases" className="block">
            <div className="block-head">
              <div><span className="section-tag">Use Case</span><h2>Apa Yang Bisa Kamu Bangun?</h2></div>
              <a href="/use-cases" className="see-all">Selengkapnya →</a>
            </div>
            <div className="uc-grid">
              <a className="uc-card uc-1"><div className="uc-ico">🎨</div><h3>Design Automation</h3><p>Generate thumbnail, banner, social post otomatis dari brief.</p><span className="uc-link">Pelajari →</span></a>
              <a className="uc-card uc-2"><div className="uc-ico">📱</div><h3>Social Media</h3><p>IG, TikTok, FB — post, comment, like, DM auto.</p><span className="uc-link">Pelajari →</span></a>
              <a className="uc-card uc-3"><div className="uc-ico">🎬</div><h3>YouTube Automation</h3><p>Riset topic → script → TTS → render → upload.</p><span className="uc-link">Pelajari →</span></a>
              <a className="uc-card uc-4"><div className="uc-ico">📸</div><h3>Microstock</h3><p>Generate + metadata + upload ke Adobe Stock, Shutterstock.</p><span className="uc-link">Pelajari →</span></a>
              <a className="uc-card uc-5"><div className="uc-ico">📊</div><h3>CRM + Pipeline</h3><p>Follow-up leads, tagging, reporting mingguan auto.</p><span className="uc-link">Pelajari →</span></a>
              <a className="uc-card uc-6"><div className="uc-ico">💬</div><h3>Customer Service</h3><p>WA bot 24/7 dengan knowledge base perusahaanmu.</p><span className="uc-link">Pelajari →</span></a>
              <a className="uc-card uc-7 uc-wide"><div className="uc-ico">🧩</div><h3>Custom SOP Workflow</h3><p>Bikin alur kerja uniquemu — visual scripting, drag-drop.</p><span className="uc-link">Buka Builder →</span></a>
            </div>
          </section>

          {/* NEWS */}
          <section id="news" className="block">
            <div className="block-head">
              <div><span className="section-tag">News &amp; Update</span><h2>Apa yang Baru?</h2></div>
              <a href="/news" className="see-all">Selengkapnya →</a>
            </div>
            <div className="news-row">
              <article className="news-card"><div className="news-tag">v0.9 · Sprint 9</div><h4>Outdoor Expansion + NPC Life</h4><p>Kota virtual di luar gedung — taman, jalan, mobil, warga.</p><small>16 Apr 2026</small></article>
              <article className="news-card"><div className="news-tag tag-green">New</div><h4>Silver Coin Launched</h4><p>Agent sekarang bisa belanja API tanpa expose kartu kreditmu.</p><small>12 Apr 2026</small></article>
              <article className="news-card"><div className="news-tag tag-pink">Agent</div><h4>15 Agen OMNYX Agency</h4><p>Seluruh tim agency digital sekarang live.</p><small>08 Apr 2026</small></article>
            </div>
          </section>

          {/* CTA */}
          <section className="cta-block">
            <div className="cta-art">🚀</div>
            <div className="cta-copy">
              <h2>Siap Bangun Virtual Office AI Agent-mu?</h2>
              <p>Gabung Mighantect — kantor virtual 3D tempat AI kerja, belajar, dan menghasilkan untukmu.</p>
              <div className="cta-btns">
                <a href="https://github.com/fahmiwol/mighantect-3d" target="_blank" className="btn-primary">⭐ Star on GitHub</a>
                <a href="#build" className="btn-ghost">Explore Buildings</a>
              </div>
            </div>
          </section>

          {/* STUDIO */}
          <section id="studio" className="block">
            <div className="block-head">
              <div><span className="section-tag">Studio</span><h2>Design Studio Tools</h2></div>
              <a href="https://ops.mighan.com/design-studio/" target="_blank" className="see-all">Buka Studio →</a>
            </div>
            <div className="tools-grid">
              {[
                { href: 'https://ops.mighan.com/design-studio/npc-generator.html', ico: '🧑', label: 'NPC Generator', desc: 'Buat & custom karakter AI agent dengan visual chibi' },
                { href: 'https://ops.mighan.com/design-studio/canvas.html', ico: '🎨', label: 'AI Canvas', desc: 'Generate gambar AI, edit prompt, unduh hasil' },
                { href: 'https://ops.mighan.com/design-studio/remove-bg.html', ico: '✂️', label: 'Remove Background', desc: 'Hapus background otomatis untuk asset microstock' },
                { href: 'https://ops.mighan.com/design-studio/photo.html', ico: '📸', label: 'Photo AI', desc: 'Enhance, upscale, dan retouch foto dengan AI' },
                { href: 'https://ops.mighan.com/design-studio/ai.html', ico: '🤖', label: 'AI Chat', desc: 'Chat langsung dengan agen AI Mighantect' },
                { href: 'https://ops.mighan.com/admin-panel/', ico: '🏢', label: 'World Builder', desc: 'Atur gedung, ruangan, dan posisi object 3D' },
                { href: 'https://ops.mighan.com/admin-panel/', ico: '📋', label: 'SOP Builder', desc: 'Buat & kelola workflow SOP agen AI' },
                { href: 'https://ops.mighan.com/design-studio/index.html', ico: '🚀', label: 'Semua Tools', desc: 'Lihat semua tool di Design Studio' },
              ].map(t => (
                <a key={t.label} className="tool-card" href={t.href} target="_blank" rel="noopener noreferrer">
                  <div className="t-ico">{t.ico}</div>
                  <b>{t.label}</b>
                  <span>{t.desc}</span>
                </a>
              ))}
            </div>
          </section>

          {/* KONTAK */}
          <section id="kontak" className="block">
            <div className="block-head">
              <div><span className="section-tag">Kontak</span><h2>Hubungi Kami</h2></div>
            </div>
            <div className="kontak-row">
              <a className="kontak-card" href="mailto:fahmiwol@gmail.com"><div className="k-ico">✉️</div><b>Email</b><span>fahmiwol@gmail.com</span></a>
              <a className="kontak-card" href="https://github.com/fahmiwol" target="_blank" rel="noopener noreferrer"><div className="k-ico">🐙</div><b>GitHub</b><span>@fahmiwol</span></a>
              <a className="kontak-card" href="#"><div className="k-ico">📱</div><b>WhatsApp</b><span>Business hub</span></a>
              <a className="kontak-card" href="#"><div className="k-ico">💬</div><b>Discord</b><span>Community</span></a>
            </div>
          </section>

          <footer className="foot">
            <span>© 2026 Mighan · Built by Fahmi Ghani</span>
            <span><a href="https://github.com/fahmiwol">GitHub</a> · <a href="#">Docs</a> · <a href="#coinomics">Coinomics</a></span>
          </footer>
        </main>
      </div>

      {/* Mobile tab bar */}
      <nav className="mobile-tabbar">
        <a href="#hero" className="tab active" data-sec="hero"><span className="tab-ico">🏠</span><span>Home</span></a>
        <a href="#agents" className="tab" data-sec="agents"><span className="tab-ico">👥</span><span>Agents</span></a>
        <a href="#build" className="tab tab-center" data-sec="build"><span className="tab-ico">+</span></a>
        <a href="#skills" className="tab" data-sec="skills"><span className="tab-ico">🧩</span><span>Skills</span></a>
        <a href="#coinomics" className="tab" data-sec="coinomics"><span className="tab-ico">🪙</span><span>Coin</span></a>
      </nav>

      {/* Agent detail modal */}
      <div className="agent-modal" id="agentModal" role="dialog" aria-modal="true" aria-hidden="true">
        <div className="am-bg" />
        <div className="am-shell">
          <header className="am-topbar">
            <button className="am-back" aria-label="Back"><span>←</span><b>Agent Detail</b></button>
            <div className="am-currency">
              <span className="c-chip c-gold">🪙 <b>1,500</b></span>
              <span className="c-chip c-silver">⚙ <b>1,500</b></span>
              <span className="c-chip c-gem">💎 <b>1,500</b></span>
            </div>
            <button className="am-close" aria-label="Close">✕</button>
          </header>
          <div className="am-body">
            <aside className="am-left">
              <div className="am-name"><h1>Sari</h1><div className="am-role">Chief Strategy Officer</div></div>
              <div className="am-rarity-pill rarity-legendary"><span className="am-rarity-label">Skin rarity</span><span className="am-rarity-value">Legendary</span></div>
              <p className="am-bio">Loading…</p>
              <div className="am-trophy">
                <div className="am-trophy-num">1</div>
                <div className="am-trophy-body"><div className="am-trophy-label">Trophy level</div><div className="am-trophy-track"><span style={{width:'40%'}} /></div><div className="am-trophy-xp">🏆 80/200</div></div>
                <button className="am-info" aria-label="Info">i</button>
              </div>
            </aside>
            <main className="am-center">
              <div className="am-hero-arrow a1" /><div className="am-hero-arrow a2" />
              <div className="am-hero-arrow a3" /><div className="am-hero-arrow a4" />
              <div className="am-hero-glow" />
              <img className="am-hero-img" src="" alt="" />
            </main>
            <aside className="am-right">
              <h3 className="am-level">Level 2</h3>
              <div className="am-skill am-skill-speciality">
                <div className="am-skill-head"><b>Speciality</b><button className="am-info" aria-label="Info">i</button></div>
                <div className="am-skill-sub">kombinasi dari skill set</div>
                <div className="am-skill-name">Deep Research · Lv. 3</div>
                <div className="am-cd-row"><span className="am-cd-label">Cooldown:</span><span className="am-cd">-12s (-6s)</span></div>
              </div>
              <div className="am-equip">
                <div className="am-equip-head"><b>Skill Set &amp; Plugin</b> <span className="am-slot-bonus">(+1 slot)</span></div>
                <div className="am-equip-grid" />
              </div>
              <div className="am-upgrade">
                <div className="am-upgrade-label">Upgrade</div>
                <div className="am-upgrade-cost"><span className="am-upgrade-gold">🪙 120</span><span className="am-upgrade-silver">⚙ 1.120</span></div>
              </div>
            </aside>
          </div>
          <footer className="am-footer">
            <button className="am-btn am-btn-customize">🎨 Customize</button>
            <button className="am-btn am-btn-select">Select</button>
          </footer>
        </div>
      </div>

      <div className="skill-tip" id="skillTip" role="tooltip" />
      <LandingScripts />
    </AuthProvider>
  )
}
