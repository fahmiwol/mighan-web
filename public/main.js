/* ===================================================
   MIGHANTECT — PixelGather landing · Mobile-native
   =================================================== */

// ============ AGENTS DATA (ID card template) ============
const AGENTS = [
  { id: 'sari', ledgerId: 'strategy-agent', name: 'Sari', role: 'Chief Strategy Officer', icon: '🧠',
    grad: 'linear-gradient(140deg,#c8b6ff 0%,#8b5cf6 55%,#6d28d9 100%)',
    tint: '#efe7ff', accent: '#8b5cf6',
    rarity: 'Legendary', price: 2500,
    specs: ['Strategy', 'Research', 'Planning'],
    bio: 'Kepala strategi Mighantect. Riset pasar, analisa kompetitor, dan framework perencanaan. Kasih brief, dia kembalikan strategy deck matang sebelum timmu mulai eksekusi.',
    level: 3, xp: 80, xpMax: 200,
    attack: { name: 'Deep Research', lv: 3, cd: 12 },
    equipped: ['deep_research', 'ideation_loop'], slotFree: 1, slotBonus: 1,
    upgrade: { gold: 120, silver: 1120 } },
  { id: 'budi', ledgerId: 'hunter', name: 'Budi', role: 'Head of Technology', icon: '💻',
    grad: 'linear-gradient(140deg,#a9c4ff 0%,#3b6df0 55%,#1e40af 100%)',
    tint: '#e1ecff', accent: '#3b6df0',
    rarity: 'Epic', price: 1800,
    specs: ['DevOps', 'Architecture', 'API'],
    bio: 'Tech lead Mighantect. Review code, set up CI/CD, arsitektur sistem, dan integrasi API. Prefer DeepSeek Coder V3. Solusi simpel > over-engineered.',
    level: 2, xp: 140, xpMax: 200,
    attack: { name: 'Architecture Plan', lv: 3, cd: 20 },
    equipped: ['code_review', 'api_integration'], slotFree: 1, slotBonus: 0,
    upgrade: { gold: 90, silver: 900 } },
  { id: 'dewi', ledgerId: 'designer', name: 'Dewi', role: 'Creative Director', icon: '🎨',
    grad: 'linear-gradient(140deg,#ffc9de 0%,#ff8fb8 55%,#e11d74 100%)',
    tint: '#ffe4ef', accent: '#ff8fb8',
    rarity: 'Epic', price: 1800,
    specs: ['Design', 'Branding', 'Creative'],
    bio: '"The Perfectionist" — taste tajam, minim basa-basi. Visual design + brand identity + AI image gen. Dina Mahesa di agent ledger. Catchphrase: "Ini hampir benar, tapi belum selesai."',
    level: 2, xp: 100, xpMax: 200,
    attack: { name: 'Visual Generate', lv: 3, cd: 8 },
    equipped: ['visual_design', 'image_gen'], slotFree: 1, slotBonus: 0,
    upgrade: { gold: 90, silver: 900 } },
  { id: 'profesor', ledgerId: 'profesor', name: 'Prof. Toard', role: 'Innovation & Research', icon: '🔬',
    grad: 'linear-gradient(140deg,#ffe2a1 0%,#f6b93b 55%,#d97706 100%)',
    tint: '#fff4d6', accent: '#f6b93b',
    rarity: 'Legendary', price: 2500,
    specs: ['Research', 'R&D', 'Ideation'],
    bio: '"The Wise Scientist" — paradoks berjalan: religius + penjelajah ide. Autonomy 24/7 di Innovation Lab (IL1-IL5): riset, ideasi, sandbox. Catchphrase: "Ilmu itu luas, tapi arah harus dijaga."',
    level: 4, xp: 160, xpMax: 250,
    attack: { name: 'Sandbox Run', lv: 4, cd: 25 },
    equipped: ['deep_research', 'ideation_loop', 'sandbox_test'], slotFree: 0, slotBonus: 1,
    upgrade: { gold: 150, silver: 1400 } },
  { id: 'iris', ledgerId: 'iris', name: 'Iris', role: 'Innovation Field Agent', icon: '🌐',
    grad: 'linear-gradient(140deg,#b6ecf5 0%,#5dd3e8 55%,#0891b2 100%)',
    tint: '#d9f5fb', accent: '#5dd3e8',
    rarity: 'Rare', price: 1200,
    specs: ['Sandbox', 'Trend', 'Experiment'],
    bio: '"The Operator" — cepat, tajam, confident. Eyes of system. Field agent yang jembatani ide Prof. Toard dengan realita operasional. Catchphrase: "We move now."',
    level: 1, xp: 40, xpMax: 150,
    attack: { name: 'Trend Scan', lv: 1, cd: 8 },
    equipped: ['trend_scan', 'field_exec'], slotFree: 1, slotBonus: 0,
    upgrade: { gold: 60, silver: 600 } },
  { id: 'rina', ledgerId: 'receptionist-ai', name: 'Rina', role: 'Marketing Manager', icon: '📣',
    grad: 'linear-gradient(140deg,#ffcfa8 0%,#ff9f59 55%,#ea580c 100%)',
    tint: '#ffe5cf', accent: '#ff9f59',
    rarity: 'Epic', price: 1800,
    specs: ['Marketing', 'Campaign', 'Growth'],
    bio: '"The Gatekeeper" — jangkar yang jaga ritme kantor. Campaign plan, buzzer scheduling, growth hacking. Connected to buzzer-engine + social-accounts registry.',
    level: 2, xp: 120, xpMax: 200,
    attack: { name: 'Campaign Launch', lv: 3, cd: 15 },
    equipped: ['campaign_plan', 'buzzer_post'], slotFree: 1, slotBonus: 0,
    upgrade: { gold: 90, silver: 900 } },
  { id: 'hafiz', ledgerId: 'pm-agent', name: 'Hafiz', role: 'Project Manager (OMNYX)', icon: '📋',
    grad: 'linear-gradient(140deg,#b8f3cc 0%,#3ecf6a 55%,#16a34a 100%)',
    tint: '#dcf7e4', accent: '#3ecf6a',
    rarity: 'Rare', price: 1200,
    specs: ['Scrum', 'Client', 'Delivery'],
    bio: 'PM OMNYX Agency. Terima brief klien → breakdown task → assign ke tim → tracking delivery. Disiplin timeline + expectation management.',
    level: 1, xp: 60, xpMax: 150,
    attack: { name: 'Task Breakdown', lv: 2, cd: 10 },
    equipped: ['task_breakdown', 'client_update'], slotFree: 1, slotBonus: 0,
    upgrade: { gold: 60, silver: 600 } },
  { id: 'kalinda', ledgerId: 'penulis', name: 'Kalinda', role: 'Content Writer', icon: '✍️',
    grad: 'linear-gradient(140deg,#ffc2c2 0%,#ff6b6b 55%,#dc2626 100%)',
    tint: '#ffdada', accent: '#ff6b6b',
    rarity: 'Rare', price: 1200,
    specs: ['Copywriting', 'SEO', 'Blog'],
    bio: 'Content writer senior OMNYX (alias "Putri Pena" di ledger). Long-form article, caption sosmed, email sequence, ad copy. SEO-aware + tone-of-voice per brand.',
    level: 1, xp: 90, xpMax: 150,
    attack: { name: 'Copy Draft', lv: 2, cd: 9 },
    equipped: ['content_draft', 'seo_optimize'], slotFree: 1, slotBonus: 0,
    upgrade: { gold: 60, silver: 600 } },
];

// ============ SKILL CATALOG (mirrors D:\Mighan real modules) ============
// Source: server/agent-capabilities.js, server/innovation-agent.js,
//         server/media-tools.js, server/buzzer-engine.js, server/agency-pipeline.js,
//         server/agent-settings.js, config/agent-ledger.json
const SKILL_CATALOG = {
  deep_research: {
    icon: '🧠', name: 'Deep Research', cat: 'Agent',
    fn: 'LLM-based market, competitor, dan trend analysis mendalam.',
    desc: 'Pakai provider LLM terbaik per agent (Claude Haiku 4.5, DeepSeek R1, Nemotron Ultra) untuk riset dengan reasoning panjang. Output disimpan sebagai research_report artifact.',
    config: 'Set provider+model via PUT /api/agent-settings/{id}\nTrigger manual: chat "riset [topik]" ke Prof. Toard\nAutonomy: Iris engine jalan tiap 6 jam (server/innovation-agent.js)'
  },
  ideation_loop: {
    icon: '💡', name: 'Ideation Loop', cat: 'Agent',
    fn: 'Autonomous idea generation — tiap 12 jam propose ide baru.',
    desc: 'Lifecycle: pending → ready_to_sandbox → in_sandbox → review_needed → approved. Tersimpan di artifacts/ideation/ideation-log.json dan auto-export ke docs/IDEATION_LOG.md.',
    config: 'GET/POST /api/iris/ideas\nMarkdown export otomatis\nInterval: 12 jam (server/innovation-agent.js)'
  },
  sandbox_test: {
    icon: '🧪', name: 'Sandbox Test', cat: 'Workflow',
    fn: 'Uji ide dalam lingkungan terisolasi sebelum eksekusi produksi.',
    desc: 'Setiap ide yang lolos review di-assign sandbox plan. Sandbox executor (opencode module port 3023) jalankan test dan kirim result untuk di-review approve/reject.',
    config: 'POST /api/iris/sandbox/{ideaId}\nStatus: in_sandbox → review_needed\nOpenCode sandbox: port 3023'
  },
  visual_design: {
    icon: '🎨', name: 'Visual Design', cat: 'Media',
    fn: 'Generate + edit gambar pakai MighanCanvas + MighanAI.',
    desc: 'Canvas 2D engine (shapes, text, image, pen) + AI generator (6 Flux model + Imagen 4). Save project ke server/.data/canvas-projects/*.json.',
    config: 'Buka /design-studio/canvas.html\nAPI: POST /api/canvas/project\nAI: POST /api/ai/generate'
  },
  image_gen: {
    icon: '🖼️', name: 'AI Image Gen', cat: 'Media',
    fn: 'Generate gambar dari prompt (Pollinations free / Imagen 4 / ComfyUI).',
    desc: 'Preset style, history 12 gambar, "Open in Canvas" integration. Agent designer punya prefer: comfyui→local_sd→ideogram→stability.',
    config: 'Settings → Image providers\n/design-studio/ai.html\nmedia-tools: 15 provider (server/media-tools.js)'
  },
  code_review: {
    icon: '💻', name: 'Code Review', cat: 'Agent',
    fn: 'LLM review arsitektur code + deteksi bug + refactor suggestion.',
    desc: 'Pakai DeepSeek Chat V3 atau Qwen 2.5 Coder 32B. Output: review_report dengan severity (critical/warn/info) dan spesifik file:line.',
    config: 'Set code model di agent-settings\nModel recommended: deepseek/deepseek-chat-v3-0324:free'
  },
  system_design: {
    icon: '🏗️', name: 'System Design', cat: 'Agent',
    fn: 'Arsitektur service + data flow + interface boundaries.',
    desc: 'Reasoning model (DeepSeek R1 / Nemotron Ultra 253B / Phi-4 Reasoning) draft diagram, pick tradeoff, dan spec per-modul.',
    config: 'Referensi: docs/PROJECT_CARTOGRAPHY.md\nChat context auto-inject ledger bio'
  },
  api_integration: {
    icon: '🔗', name: 'API Integration', cat: 'API',
    fn: 'Wire third-party API ke Mighantect gateway (endpoint + proxy).',
    desc: 'Pattern: daftar endpoint di server/gateway.js, setup proxy route, atomic writes untuk state. Plugin system support JS function + webhook + JSON schema.',
    config: 'Settings → API keys (server/settings.json)\nGateway: POST /api/plugins/register\nExamples: /api/wagateway/*, /api/microstock/*'
  },
  trend_scan: {
    icon: '📡', name: 'Trend Scan', cat: 'Agent',
    fn: 'Monitor trending topic real-time (7 kategori).',
    desc: 'Kategori: 3D/metaverse, AI agents, microstock, design tools, bisnis digital, gaming, blockchain. Alert via inbox socket.io event.',
    config: 'GET /api/iris/status\nHeartbeat interval: 6 jam\nTopic list: 40+ (server/innovation-agent.js)'
  },
  field_exec: {
    icon: '⚡', name: 'Field Execution', cat: 'Workflow',
    fn: 'Eksekusi cepat aksi konkret dari ide yang sudah di-approve.',
    desc: 'Iris = field agent. Jalankan action item dari ideation log, update status backlog, notify Fahmi via inbox.',
    config: 'POST /api/iris/ideas/{id}/execute\nFallback: content-backlog priority queue'
  },
  campaign_plan: {
    icon: '📣', name: 'Campaign Plan', cat: 'Workflow',
    fn: 'Strategi + timeline campaign marketing (6-fase pipeline).',
    desc: 'Brief → strategy (Sari) → creative (Dewi) → copy (Kalinda) → images (designer) → backlog (scheduler). Full handoff antar agent.',
    config: 'POST /api/agency/brief\nMonitor: MighanAdmin tab Agency\nserver/agency-pipeline.js'
  },
  buzzer_post: {
    icon: '🤖', name: 'Buzzer Bot', cat: 'Connect',
    fn: 'Auto-post FB/IG/TikTok via API (OAuth) atau Playwright (browser).',
    desc: 'Poll loop 1 menit, rate limit per platform (IG 10/hour, TikTok 8/hour), proxy per account untuk anti-spam. Session cookies per username.',
    config: 'server/buzzer-engine.js\nGET/POST /api/social/accounts\n/api/backlog (queue)\n/api/buzzer/start|stop'
  },
  content_draft: {
    icon: '✍️', name: 'Content Draft', cat: 'Agent',
    fn: 'Tulis blog/caption/email/ad copy (SEO-aware).',
    desc: 'Agent penulis (Putri Pena): long-form, caption, storytelling. Model prefer: Llama 3.3 70B / Qwen 235B / Minimax M1.',
    config: 'PUT /api/agent-settings/kalinda { provider, model }\nOutput: artifacts/outputs/*.md'
  },
  seo_optimize: {
    icon: '🔎', name: 'SEO Optimize', cat: 'Agent',
    fn: 'Keyword research + metadata + alt text + taxonomy.',
    desc: 'Agent pustakawan (Bima Arsip): keyword list, meta description, tags, kategori tree. Pakai Gemma 3 27B untuk efficient extraction.',
    config: 'Capability: research.tasks=["SEO audit"]\nServer skill: server/agent-capabilities.js (pustakawan)'
  },
  task_breakdown: {
    icon: '📋', name: 'Task Breakdown', cat: 'Workflow',
    fn: 'Parse brief klien jadi task list + estimasi + assign ke tim.',
    desc: 'Hafiz (PM OMNYX) ambil brief → breakdown ke subtask → assign agent by specialty → tracking delivery.',
    config: 'server/agency-pipeline.js phase 1\nPOST /api/agency/brief\nWorkflow Editor visual SOP'
  },
  client_update: {
    icon: '📨', name: 'Client Update', cat: 'Connect',
    fn: 'Auto-generate status report mingguan dari project state.',
    desc: 'Fetch project state + backlog + completed tasks → render template report → send via inbox/email.',
    config: 'POST /api/agency/report\nTemplate: artifacts/templates/report.md\nInbox thread + socket event'
  },
  scheduler: {
    icon: '⏰', name: 'Scheduler', cat: 'Workflow',
    fn: 'Jadwal posting/task berulang (immediate / scheduled / interval).',
    desc: 'Content-backlog queue: type, sequence, priority 1-5, schedule mode. Atomic writes + backup. Sequence mode untuk multi-step dengan delay antar aksi.',
    config: 'server/content-backlog.js\nGET/POST /api/backlog\nPOST /api/backlog/bulk'
  },
  discord_notify: {
    icon: '💬', name: 'Discord Notify', cat: 'Connect',
    fn: 'Kirim update ke Discord channel (webhook atau bot).',
    desc: 'Alert task done/failed, share artifact, notif approval pending. Connector module standalone port 3046.',
    config: 'Mighan-tasks/connectors/by-opencode-discord-connector port 3046\nSettings → Discord webhook URL'
  },
  tts_voice: {
    icon: '🎤', name: 'TTS Voice', cat: 'Media',
    fn: 'Text-to-speech dengan voice clone (Edge TTS gratis + ElevenLabs).',
    desc: 'VoiceClone Studio standalone (FastAPI port 8001 + React UI 3000). Support 5 provider: edge_tts, fish_audio, google_tts, elevenlabs, openai_tts.',
    config: 'Mighan-tasks/TTS (API :8001 + UI :3000)\nSettings → TTS provider key'
  }
};

// ============ SKILLS DATA ============
const SKILLS = [
  { name: 'NPC Brain',     cat: 'agent',    icon: '🧠', color: '#e9dcff', badge: 'CORE' },
  { name: 'Vision Agent',  cat: 'agent',    icon: '👁️', color: '#c5f1f8' },
  { name: 'Text Writer',   cat: 'agent',    icon: '✍️', color: '#ffd1d1' },
  { name: 'Coder',         cat: 'agent',    icon: '💻', color: '#d4e5ff' },
  { name: 'Researcher',    cat: 'agent',    icon: '🔬', color: '#fff3b3' },
  { name: 'Data Analyst',  cat: 'agent',    icon: '📊', color: '#d9f5e4' },
  { name: 'Image Gen',     cat: 'media',    icon: '🎨', color: '#ffd9ea', badge: 'HOT' },
  { name: 'Video AI',      cat: 'media',    icon: '🎬', color: '#ffe0a8' },
  { name: 'TTS Voice',     cat: 'media',    icon: '🎤', color: '#d6ffd8' },
  { name: 'Remove BG',     cat: 'media',    icon: '✂️', color: '#ffd1d1' },
  { name: 'Upscale AI',    cat: 'media',    icon: '☀️', color: '#fff3b3' },
  { name: 'Canvas',        cat: 'media',    icon: '🖼️', color: '#e0e8ff' },
  { name: 'SOP Builder',   cat: 'workflow', icon: '⚡', color: '#fff3b3', badge: 'CORE' },
  { name: 'Map Editor',    cat: 'workflow', icon: '🗺️', color: '#d9f5e4' },
  { name: 'Autopilot',     cat: 'workflow', icon: '🤖', color: '#e9dcff' },
  { name: 'Scheduler',     cat: 'workflow', icon: '⏰', color: '#ffe0a8' },
  { name: 'REST API',      cat: 'api',      icon: '🔗', color: '#d4e5ff' },
  { name: 'SSE Stream',    cat: 'api',      icon: '📡', color: '#c5f1f8' },
  { name: 'Multi-LLM',     cat: 'api',      icon: '🧬', color: '#e0e8ff', badge: 'NEW' },
  { name: 'WA Gateway',    cat: 'connect',  icon: '💬', color: '#d6ffd8' },
  { name: 'Social Hub',    cat: 'connect',  icon: '📱', color: '#ffd9ea' },
  { name: 'Microstock',    cat: 'connect',  icon: '🏪', color: '#fff3b3' },
];

// ============ RENDER ID CARDS ============
function renderAgents() {
  const row = document.getElementById('idCardRow');
  if (!row) return;
  if (window.matchMedia('(max-width: 860px)').matches) row.classList.add('swipe');

  row.innerHTML = AGENTS.map(a => `
    <article class="id-card rarity-${a.rarity.toLowerCase()}" data-agent="${a.id}" style="--acc:${a.accent};--tint:${a.tint}">
      <div class="id-portrait" style="background:${a.grad}">
        <span class="id-rarity">${a.rarity}</span>
        <span class="id-status"><span class="id-dot"></span>Online</span>
        <img class="id-photo" src="assets/agents/${a.id}.png" alt="${a.name}" loading="lazy"
             onerror="this.classList.add('img-fail');this.replaceWith(Object.assign(document.createElement('div'),{className:'id-avatar',textContent:'${a.icon}'}))"/>
        <span class="id-sparkle s1"></span>
        <span class="id-sparkle s2"></span>
        <span class="id-sparkle s3"></span>
      </div>
      <div class="id-info">
        <div class="id-meta">
          <div>
            <div class="id-name">${a.name}</div>
            <div class="id-role">${a.role}</div>
          </div>
          <span class="id-price"><span class="coin-chip">◉</span>${a.price.toLocaleString('id-ID')}</span>
        </div>
        <div class="id-spec">
          ${a.specs.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
        <div class="id-btns">
          <button class="id-btn detail">Detail</button>
          <button class="id-btn hire">Hire →</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ============ RENDER SKILLS ============
const CAT_DESC = {
  agent: 'Otak AI — hire agent ini ke world-mu, beri kepribadian + skill, biarkan kerja 24/7.',
  media: 'Tool media generatif — bikin gambar, video, suara, atau 3D langsung dari prompt.',
  workflow: 'Otomasi — rangkai SOP, jadwal, dan autopilot supaya agent jalan sendiri.',
  api: 'Integrasi developer — hubungkan world-mu lewat REST, SSE, atau multi-LLM.',
  connect: 'Konektor — sambungkan ke WhatsApp, sosial media, dan microstock.'
};
function renderSkills(filter = 'all') {
  const grid = document.getElementById('skillGrid');
  if (!grid) return;
  const list = filter === 'all' ? SKILLS : SKILLS.filter(s => s.cat === filter);
  grid.innerHTML = list.map(s => `
    <div class="skill-card" role="button" tabindex="0" style="cursor:pointer" data-name="${s.name}" data-cat="${s.cat}" data-icon="${s.icon}" data-color="${s.color}">
      ${s.badge ? `<span class="badge ${s.badge.toLowerCase()}">${s.badge}</span>` : ''}
      <div class="skill-ico" style="background:${s.color}">${s.icon}</div>
      <h4>${s.name}</h4>
      <div class="cat">${s.cat}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.skill-card').forEach(c => {
    const open = () => openSkillModal(c.dataset);
    c.addEventListener('click', open);
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}
function openSkillModal(d) {
  let m = document.getElementById('skillModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'skillModal';
    m.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(10,12,30,.55);backdrop-filter:blur(3px)';
    m.addEventListener('click', e => { if (e.target === m) m.style.display = 'none'; });
    document.body.appendChild(m);
  }
  const cat = d.cat || 'agent';
  m.innerHTML = '<div style="background:#fff;border-radius:18px;max-width:360px;width:90%;padding:26px;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center;font-family:inherit">'
    + '<div style="width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 14px;background:' + (d.color || '#eee') + '">' + (d.icon || '🧩') + '</div>'
    + '<h3 style="margin:0 0 4px;font-size:20px;font-weight:800;color:#1a1630">' + (d.name || '') + '</h3>'
    + '<div style="font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#8a7fb0;margin-bottom:12px">' + cat + '</div>'
    + '<p style="font-size:14px;color:#4a4660;line-height:1.5;margin-bottom:20px">' + (CAT_DESC[cat] || '') + '</p>'
    + '<a href="/register" style="display:inline-block;background:linear-gradient(90deg,#7c5cff,#22d3a6);color:#fff;text-decoration:none;font-weight:800;padding:12px 22px;border-radius:12px">Daftar untuk pakai →</a>'
    + '<div style="margin-top:12px"><button id="skillModalClose" style="background:none;border:none;color:#9a93b5;font-size:13px;cursor:pointer">Tutup</button></div>'
    + '</div>';
  m.style.display = 'flex';
  const cb = document.getElementById('skillModalClose'); if (cb) cb.onclick = () => { m.style.display = 'none'; };
}

// ============ FILTER CHIPS ============
function wireFilter() {
  document.querySelectorAll('.chip-filter .chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chip-filter .chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSkills(btn.dataset.cat);
    });
  });
}

// ============ PRODUK SUBNAV ============
function wireProduk() {
  const btn = document.getElementById('btnProduk');
  const sub = document.getElementById('subProduk');
  if (!btn || !sub) return;

  // Default open di desktop
  if (!window.matchMedia('(max-width: 860px)').matches) {
    btn.setAttribute('aria-expanded', 'true');
    sub.classList.add('open');
  }

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !open);
    sub.classList.toggle('open', !open);
  });
}

// ============ MOBILE DRAWER ============
function wireDrawer() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('drawerOverlay');
  const menu = document.getElementById('mMenu');
  if (!sidebar || !overlay || !menu) return;

  const open = () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  menu.addEventListener('click', open);
  overlay.addEventListener('click', close);

  // Close saat klik link di sidebar (mobile)
  sidebar.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 860px)').matches) close();
    });
  });
}

// ============ SCROLL SPY (sidebar + tabbar) ============
function wireScrollSpy() {
  const sectionIds = ['hero', 'demo', 'build', 'agents', 'about', 'skills', 'plugins', 'builder', 'features', 'coinomics', 'usecases', 'news', 'kontak'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  // Map ke nav target (fallback)
  const spyMap = {
    hero: 'hero', demo: 'hero', build: 'hero',
    agents: 'agents',
    about: 'about',
    skills: 'skills', plugins: 'skills',
    builder: 'usecases', features: 'usecases', usecases: 'usecases',
    coinomics: 'coinomics',
    news: 'news', kontak: 'kontak'
  };

  const sideLinks = document.querySelectorAll('.side-link[data-sec], .sub-link[data-sec]');
  const tabLinks = document.querySelectorAll('.mobile-tabbar .tab[data-sec]');

  const setActive = (id) => {
    const target = spyMap[id] || id;
    sideLinks.forEach(l => l.classList.toggle('active', l.dataset.sec === id || l.dataset.sec === target));
    tabLinks.forEach(t => {
      const match = t.dataset.sec === id || t.dataset.sec === target;
      t.classList.toggle('active', match);
    });
  };

  const obs = new IntersectionObserver((entries) => {
    // Ambil entry paling atas yang intersect
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible[0]) setActive(visible[0].target.id);
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => obs.observe(s));
}

// ============ SMOOTH SCROLL ============
function wireSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = window.matchMedia('(max-width: 860px)').matches ? 70 : 20;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

// ============ ID CARD CLICK ============
function wireCards() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.id-btn');
    if (btn) {
      e.stopPropagation();
      const card = btn.closest('.id-card');
      const agentId = card?.dataset.agent;
      const agent = AGENTS.find(a => a.id === agentId);
      if (!agent) return;
      if (btn.classList.contains('hire')) {
        btn.textContent = '✓ Hired';
        btn.style.background = 'var(--green-deep)';
        setTimeout(() => { btn.textContent = 'Hire →'; btn.style.background = ''; }, 1400);
      } else {
        openAgentModal(agent);
      }
    }
  });
}

// ============ AGENT DETAIL MODAL (RPG-style) ============
function openAgentModal(a) {
  const modal = document.getElementById('agentModal');
  if (!modal) return;
  modal.style.setProperty('--acc', a.accent);
  modal.style.setProperty('--tint', a.tint);
  modal.style.setProperty('--grad', a.grad);

  const xpPct = Math.round((a.xp / a.xpMax) * 100);
  const totalSlots = 8;
  const equippedCount = a.equipped.length;
  const freeCount = a.slotFree;
  const lockedCount = totalSlots - equippedCount - freeCount;

  const slotsHTML = [
    ...a.equipped.map((sid, i) => {
      const sk = SKILL_CATALOG[sid];
      if (!sk) return '';
      return `<div class="am-slot filled" data-skill="${sid}" tabindex="0">
        ${i < 2 ? '<span class="am-slot-badge">New</span>' : ''}
        <span class="am-slot-ico">${sk.icon}</span>
      </div>`;
    }),
    ...Array(freeCount).fill(0).map((_, i) =>
      `<div class="am-slot add"${i === 0 && a.slotBonus ? ' data-bonus="1"' : ''}>+</div>`),
    ...Array(Math.max(0, lockedCount)).fill(0).map(() => `<div class="am-slot locked">🔒</div>`)
  ].slice(0, totalSlots).join('');

  modal.querySelector('.am-hero-img').src = `assets/agents/${a.id}.png`;
  modal.querySelector('.am-hero-img').alt = a.name;
  modal.querySelector('.am-name h1').textContent = a.name;
  modal.querySelector('.am-role').textContent = a.role;
  modal.querySelector('.am-rarity-value').textContent = a.rarity;
  modal.querySelector('.am-rarity-pill').className = `am-rarity-pill rarity-${a.rarity.toLowerCase()}`;
  modal.querySelector('.am-bio').textContent = a.bio;
  modal.querySelector('.am-trophy-num').textContent = a.level;
  modal.querySelector('.am-trophy-track span').style.width = xpPct + '%';
  modal.querySelector('.am-trophy-xp').innerHTML = `🏆 ${a.xp}/${a.xpMax}`;

  modal.querySelector('.am-level').textContent = `Level ${a.level}`;
  modal.querySelector('.am-skill-speciality .am-skill-name').textContent = `${a.attack.name} · Lv. ${a.attack.lv}`;
  modal.querySelector('.am-skill-speciality .am-cd').textContent = `-${a.attack.cd}s (-${Math.round(a.attack.cd/2)}s)`;

  modal.querySelector('.am-equip-head .am-slot-bonus').textContent = a.slotBonus > 0 ? `(+${a.slotBonus} slot)` : '';
  modal.querySelector('.am-equip-grid').innerHTML = slotsHTML;

  modal.querySelector('.am-upgrade-gold').textContent = `🪙 ${a.upgrade.gold}`;
  modal.querySelector('.am-upgrade-silver').textContent = `⚙ ${a.upgrade.silver.toLocaleString('id-ID')}`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAgentModal() {
  const modal = document.getElementById('agentModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function showSkillTooltip(slotEl) {
  const tip = document.getElementById('skillTip');
  const sid = slotEl.dataset.skill;
  const sk = SKILL_CATALOG[sid];
  if (!tip || !sk) return;

  tip.innerHTML = `
    <div class="tip-head">
      <span class="tip-ico">${sk.icon}</span>
      <div>
        <b class="tip-name">${sk.name}</b>
        <span class="tip-cat">${sk.cat}</span>
      </div>
    </div>
    <div class="tip-row"><span class="tip-label">Function</span><p>${sk.fn}</p></div>
    <div class="tip-row"><span class="tip-label">Description</span><p>${sk.desc}</p></div>
    <div class="tip-row"><span class="tip-label">Config</span><pre>${sk.config}</pre></div>
  `;

  // Position: left of slot, fallback right if not enough space
  const rect = slotEl.getBoundingClientRect();
  tip.style.visibility = 'hidden';
  tip.classList.add('show');
  const tipW = tip.offsetWidth;
  const tipH = tip.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = rect.left - tipW - 12;
  let top = rect.top + (rect.height / 2) - (tipH / 2);
  let arrowSide = 'right';
  if (left < 12) { left = rect.right + 12; arrowSide = 'left'; }
  if (top < 12) top = 12;
  if (top + tipH > vh - 12) top = vh - tipH - 12;

  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
  tip.dataset.arrow = arrowSide;
  tip.style.visibility = '';
}

function hideSkillTooltip() {
  const tip = document.getElementById('skillTip');
  if (tip) tip.classList.remove('show');
}

function wireAgentModal() {
  const modal = document.getElementById('agentModal');
  if (!modal) return;

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('am-bg') ||
        e.target.closest('.am-close') ||
        e.target.closest('.am-back')) {
      closeAgentModal();
      hideSkillTooltip();
    }
    const slot = e.target.closest('.am-slot.filled');
    if (slot) {
      // Toggle tooltip on click (mobile-friendly)
      const tip = document.getElementById('skillTip');
      if (tip && tip.classList.contains('show') && tip._activeSlot === slot) {
        hideSkillTooltip();
        tip._activeSlot = null;
      } else {
        showSkillTooltip(slot);
        if (tip) tip._activeSlot = slot;
      }
      return;
    }
    if (e.target.closest('.am-slot.add')) {
      alert('Equip skill baru — pilih dari inventory (demo).');
      return;
    }
    if (e.target.closest('.am-btn-select')) {
      closeAgentModal(); hideSkillTooltip();
      alert('Agent di-hire! (demo)');
      return;
    }
    if (e.target.closest('.am-btn-customize')) {
      alert('Customize avatar (demo) — edit wajah, warna, outfit.');
      return;
    }
    // Click outside slot → hide tooltip
    if (!e.target.closest('#skillTip')) hideSkillTooltip();
  });

  // Hover (desktop only — touch devices will use click)
  const hasHover = window.matchMedia('(hover: hover)').matches;
  if (hasHover) {
    modal.addEventListener('mouseover', (e) => {
      const slot = e.target.closest('.am-slot.filled');
      if (slot) showSkillTooltip(slot);
    });
    modal.addEventListener('mouseout', (e) => {
      const slot = e.target.closest('.am-slot.filled');
      if (slot && !e.relatedTarget?.closest('#skillTip')) hideSkillTooltip();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeAgentModal();
      hideSkillTooltip();
    }
  });
}

// ============ PERF: prefer-reduced-motion ============
function applyReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--anim', 'none');
  }
}

// ============ BOOT ============
function __mighanBoot() {
  renderAgents();
  renderSkills();
  wireFilter();
  wireProduk();
  wireDrawer();
  wireSmoothScroll();
  wireScrollSpy();
  wireCards();
  wireAgentModal();
  applyReducedMotion();
}
// Boot saat DOM siap. PENTING: kalau script di-inject Next.js SETELAH load
// (LandingScripts useEffect), event DOMContentLoaded sudah lewat → boot langsung,
// kalau tidak grid agent (#idCardRow) + modal tak pernah ke-render.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __mighanBoot);
else __mighanBoot();
