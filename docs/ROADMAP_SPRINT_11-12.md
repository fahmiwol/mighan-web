# Mighantect Roadmap — Sprint 11 & 12

**Created:** 2026-04-20 · **Author:** Claude Opus 4.7 (CTO session)
**Decision:** Fix aplikasi utama dulu, website polish belakangan.

## Konteks Keputusan

Website landing sudah cukup polished (8 kartu agent + detail modal + skill tooltip + Coinomics). Tapi gateway `:9797` DOWN saat dicek, dan repo punya **5 worktree paralel** dengan uncommitted changes. Website yang cantik tanpa aplikasi yang delivernya = conversion mati di klik kedua. Fondasi harus benar dulu.

---

# SPRINT 11 — Clean Baseline + App Hardening

**Total target:** 7–10 hari kerja
**Goal:** Aplikasi utama Mighantect 3D jalan stabil end-to-end, semua WIP sessions digabung, baseline clean untuk website launch di Sprint 12.

---

## 🔧 Sprint 11-A · Worktree Reconciliation (1 hari)

**Problem:** 5 worktree paralel + uncommitted changes di main.

**Tasks:**
- [ ] Review diff per worktree vs main:
  - `modest-black` (commit 8902e5d) — Sprint 9 sync point
  - `keen-driscoll` (d5ab521) — Sprint 9A-9E NPC Module + Workflow Engine + Admin v2
  - `hopeful-bhabha-c9df47` (2b8c4bf) — STATE_OF_MIGHANTECT consolidation
  - `pedantic-shamir-b2c8ba` (f9bf426) — sama dengan main head
  - `zen-clarke-afcc8f` (b6b6c86) — landing page (Sprint 10-A/B/C)
- [ ] Decision tree per worktree: merge · archive · rebase · discard
- [ ] PR zen-clarke ke main (landing page siap publish)
- [ ] Commit pending main uncommitted:
  - `server/media-tools.js` (modified)
  - `src/core/Game3D.js` (modified)
  - `src/ui/WorkflowEditor.js` (modified)
  - `Mighan-tasks/TTS` (submodule/module untracked)
  - `Mighan-tasks/opencode/` (new)
  - `docs/SPRINT_9_DELIVERABLES.md` (new)

**Exit criteria:** `git worktree list` hanya main + 1 active session worktree. `git status` clean di main.

---

## ⚙️ Sprint 11-B · Gateway & Service Startup (1 hari)

**Problem:** Gateway `:9797` DOWN saat Sprint 10-C cek. `start.bat` harus 100% reliable — satu klik semua service up.

**Tasks:**
- [ ] Audit `start.bat` — cek semua dependency check (`if not exist node_modules\paket`)
- [ ] Pastikan start sequence benar: rembg (FastAPI 9799) → gateway (9797) → static (8080) → TTS (8001+3000) → Mighan-tasks opsional
- [ ] `/health` endpoint harus ijo untuk semua modul registered
- [ ] Fix dependency yang missing (TTS punya package.json baru? sharp installed?)
- [ ] Logging konsisten di tiap service (startup log visible di console)
- [ ] Dokumentasikan startup sequence di `docs/STARTUP_GUIDE.md`

**Exit criteria:** `start.bat` di double-click dari clean boot → semua service up dalam 30 detik, `/health` semua ijo.

---

## 🎮 Sprint 11-C · E2E Core Loop (2 hari)

**Problem:** Belum ada full e2e test dari landing → 3D world → chat → generate → save.

**Tasks:**
- [ ] `localhost:8080` load, 3D world render tanpa console error
- [ ] Click tiap gedung (Lobby, OMNYX, Library, Innovation Lab, Operasi) → lift panel muncul
- [ ] Click tiap room → room panel render dengan furniture + agent
- [ ] Chat dengan 8 hero agent (Sari, Budi, Dewi, Prof.Toard, Iris, Rina, Hafiz, Kalinda) — test semua respond via LLM
- [ ] Test SSE streaming (`_trySendStream` di ChatPanel.js) — token muncul live
- [ ] Test per-agent model routing (`PUT /api/agent-settings/sari` → reload chat → confirm model switch)
- [ ] Test Design Studio dari dalam dunia: click api_panel L2 → Microstock Connect Panel buka
- [ ] Test credit system: chat agent expensive → approval queue triggered → approve via chat

**Exit criteria:** 10 click-path test case lulus tanpa error/manual intervention.

---

## 🎨 Sprint 11-D · Design Studio Audit (1 hari)

**Problem:** MighanCanvas/AI/Photo/Remove udah done tapi belum di-test integration.

**Tasks:**
- [ ] `/design-studio/remove-bg.html` — upload gambar, rembg FastAPI respond, result downloaded
- [ ] `/design-studio/canvas.html` — bikin project, tambah shape+text+image, undo/redo, save ke `/api/canvas/project`, load balik
- [ ] `/design-studio/photo.html` — filter CSS preset berfungsi, export PNG
- [ ] `/design-studio/ai.html` — generate Pollinations, switch model, "Open in Canvas" integration
- [ ] Link balik ke World (breadcrumb home)

**Exit criteria:** 4 modul design studio test pass + CRUD canvas project jalan.

---

## 🤖 Sprint 11-E · Automation Audit (2 hari)

**Problem:** Sprint 8 automation infra (content-backlog, buzzer, microstock) belum end-to-end tested.

**Tasks:**
- [ ] Content-backlog — POST item → sequence multi-step → priority queue → status update
- [ ] Social-accounts — add account (playwright + api_key both), rate-limit enforced
- [ ] Buzzer-engine — dry-run mode (tanpa real post), poll loop 1 menit log jalan, Socket.io event broadcast
- [ ] Microstock-adobe — upload 1 gambar test ke Adobe Stock (sandbox kalau ada) atau mock mode
- [ ] Microstock autonomy — manual trigger 1 cycle (generate→enhance→upload), verify result di UI
- [ ] Agency-pipeline — submit brief via MighanAdmin → 6-fase run → backlog terisi
- [ ] YouTube agent — dry-run script→TTS→thumbnail (tanpa upload real)

**Exit criteria:** Dry-run semua pipeline pass. Dashboard MighanAdmin show live status.

---

## 📊 Sprint 11-F · Admin Dashboard Final (1 hari)

**Problem:** MighanAdmin udah banyak tab tapi konsistensi + polish level perlu.

**Tasks:**
- [ ] Command Center tab (home `/admin`) — KPI row akurat dari real API
- [ ] Services Status — probe `/health` per service, warna hijau/merah
- [ ] Quick Epic Actions — 8 tombol trigger workflow sering pakai
- [ ] Live Events feed — socket.io connected, show real events
- [ ] Agent Snapshot — emotion decay visible
- [ ] Fix layout bugs (overflow, tab switch)

**Exit criteria:** MighanAdmin = control tower yang bisa dipakai operasional sehari-hari.

---

# SPRINT 12 — Website Launch & Core SaaS UI

**Total target:** 7–10 hari kerja
**Goal:** Website Mighantect.com siap launch publik. Dua core SaaS feature (NPC Editor + World Builder) MVP live.

---

## 📄 Sprint 12-A · Detail Pages (2 hari)

**Tasks:** Bikin 7 halaman detail yang di-link dari "Selengkapnya →" di landing:

- [ ] `/about` — story Mighantect, visi Agentic AI NPC SaaS, Fahmi founder section
- [ ] `/coinomics` — detail Gold/Silver, flow diagram animated, pricing tier
- [ ] `/builder` — Room Builder walkthrough, 200+ preset library, video demo
- [ ] `/features` — Visual SOP Workflow full spec, node types, example flows
- [ ] `/use-cases` — 7 use case dalemin jadi case study
- [ ] `/news` — changelog v0.9 Sprint 9, v0.10 Sprint 10, roadmap publik
- [ ] `/kontak` — form contact terintegrasi (via /api/wagateway atau Discord webhook)

Stack: tetap vanilla HTML/CSS/JS, reuse `style.css`. Template umum: hero + content + related-links footer.

---

## 🎭 Sprint 12-B · NPC Editor UI v0 (2 hari)

**Ref:** Brawl Stars character detail + "Choose an Eggy" face selector.

**Tasks:**
- [ ] Face selector grid (expression, eyes, mouth) — 20 preset
- [ ] Color picker skin tone + hair color
- [ ] Dye Clothes — outfit primary/secondary color swatch
- [ ] Accessories slot (topi, kacamata, aksesoris) — 15 item
- [ ] 360° preview (CSS rotate 3D Canvas atau Three.js minimal)
- [ ] Save → POST to new endpoint `/api/npc/appearance` (stub dulu, store ke JSON)
- [ ] NPC rarity badge (Common/Rare/Epic/Legendary)

**Exit criteria:** User bisa custom 1 NPC, preview real-time, save ke backend.

---

## 🗺️ Sprint 12-C · World Builder v0 (2 hari)

**Ref:** Telemate isometric city + mobile room deco game.

**Tasks:**
- [ ] Isometric grid canvas (CSS transform + divs grid-based)
- [ ] Building sprite library (Office, Lab, Studio, CS Center, Library) — 10 sprite
- [ ] Drag-drop: tarik sprite ke grid slot, snap to tile
- [ ] Terrain picker (grass, road, water, sidewalk) — swap tile
- [ ] Save layout → POST `/api/world/layout`
- [ ] Export JSON → copy ke `config/world.json` (atau tab preview)

**Exit criteria:** User bisa bangun kota sederhana (5 gedung + jalan), save, load balik.

---

## 🚀 Sprint 12-D · Deploy Publik (1 hari)

**Tasks:**
- [ ] Copy landing + detail pages ke repo GitHub Pages (atau repo #2 `NPC Agent AI Ecosystem`)
- [ ] CI: auto-build on push main
- [ ] Custom domain kalau ada (mighantect.com / mighan.app)
- [ ] Plausible/Umami analytics (privacy-friendly)
- [ ] Waitlist form (simpan ke sheet via Google Form proxy atau gateway endpoint)
- [ ] OG image + meta tags per page
- [ ] robots.txt + sitemap.xml

**Exit criteria:** URL publik live + 10 orang bisa akses tanpa error + analytics tracking jalan.

---

# Priority Matrix

| Sprint | Hari | Blocking? | Why |
|--------|------|-----------|-----|
| 11-A Worktree | 1 | YES | Semua sprint berikutnya butuh clean baseline |
| 11-B Startup | 1 | YES | E2E test butuh service up |
| 11-C E2E | 2 | YES | Konfirmasi fondasi jalan sebelum pitch/launch |
| 11-D Design Studio | 1 | NO | Bisa paralel dgn 11-E |
| 11-E Automation | 2 | NO | Bisa paralel dgn 11-D |
| 11-F Admin | 1 | NO | Nice-to-have for demo |
| 12-A Detail pages | 2 | YES for launch | Landing link promise |
| 12-B NPC Editor | 2 | NO | Core USP SaaS feature |
| 12-C World Builder | 2 | NO | Core USP SaaS feature |
| 12-D Deploy | 1 | YES for launch | Exit criteria |

---

# Milestones

- **M1 — Baseline Clean** (akhir Sprint 11-A+B+C): App utama jalan stabil, repo bersih, 1 PR open (zen-clarke). ~4 hari.
- **M2 — Feature Complete** (akhir Sprint 11-D+E+F): Design Studio + Automation + Admin tested + polished. ~4 hari lagi.
- **M3 — Website Launch** (akhir Sprint 12-A+D): Publik URL live dengan 7 halaman. ~3 hari.
- **M4 — SaaS MVP** (akhir Sprint 12-B+C): NPC Editor + World Builder hidup. ~4 hari lagi.

**Total dari sekarang ke M4:** ~15 hari kerja.

---

# Parallelization Suggestions

- **Agent paralel:** 11-D + 11-E bisa dikerjakan 2 sesi Claude paralel (beda worktree). 12-B + 12-C juga.
- **Autonomy:** 11-E (automation audit) bagus dilanjut via ScheduleWakeup cronjob — Iris/Prof.Toard bisa bantu dry-run test.
- **Delegate:** 12-A detail pages bisa di-template, Kalinda (content writer agent) generate draft copy.

---

# Risk & Mitigation

| Risk | Mitigation |
|------|-----------|
| Worktree merge conflict parah | Backup branch sebelum merge, per-worktree review |
| Gateway break saat audit | Rollback plan via `git stash` per task |
| 3rd-party API rate limit (Pollinations, Adobe) | Mock mode di tiap pipeline saat audit |
| Scope creep (bikin fitur baru saat audit) | Strict rule: audit = only fix existing, no new feature |
| Launch tanpa domain | Pakai GitHub Pages default URL sambil nunggu domain |
