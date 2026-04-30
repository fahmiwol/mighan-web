# Mighantect SaaS — Product Vision & Roadmap
> Dibuat: 2026-04-30 | Claude Code (CTO Role)  
> Sumber: Ide Fahmi + Analisis + Best Practice UX/Conversion

---

## 🎯 NORTH STAR

> **"Setiap bisnis, komunitas, atau individu punya virtual space sendiri — berisi AI agents yang bekerja 24/7, dengan tampilan dan fungsi yang bisa dikustomisasi penuh."**

Mighantect SaaS = **Shopify untuk Virtual Office** berbasis AI.  
Engine = `ops.mighan.com` (Three.js).  
Portal = `mighan.com` (Next.js SaaS dashboard).  
Room = `room.mighan.com/{roomId}` (per-user world).

---

## 🏗️ ARSITEKTUR PRODUK

```
mighan.com                    → SaaS portal (landing, auth, dashboard)
├── /                         → Landing + Playground CTA
├── /playground               → Sandbox demo (no auth needed)
├── /register → /login        → Auth
└── /dashboard                → User control center
    ├── /rooms                → List rooms
    ├── /rooms/{id}           → Room detail + management
    ├── /marketplace          → Browse NPC, Object, Skill
    ├── /npcs                 → All hired NPCs
    ├── /objects              → All owned objects
    └── /wallet               → Ixonomic balance + top-up + history

room.mighan.com/{roomId}      → 3D room runtime (Next.js /room/[roomId])
                                 Auth check → fetch room state from gateway
                                 Embed iframe: ops.mighan.com/room-viewer?roomId=X&token=Y
                                 (user mode: engine aktif, admin panels tersembunyi)
ixonomic.com                  → Wallet + coin system (external)
ops.mighan.com                → Global inventory: Three.js engine + assets + tools
                                 ADMIN-ONLY direct access (Fahmi + dev)
                                 Serves /room-viewer path untuk user iframe (engine saja)
```

---

## 👤 USER TYPES & ROLES

### Subscription Tiers

| Tier | Harga (Coin IX) | Room | NPC/room | Object/room | Members/room | Custom Domain |
|------|----------------|------|----------|-------------|--------------|---------------|
| **Free** | 0 | 1 | 3 | 20 | 1 (owner) | ❌ |
| **Starter** | 500/bln | 3 | 10 | 50 | 5 | ❌ |
| **Pro** | 2000/bln | 10 | 25 | 200 | 20 | ✅ |
| **Enterprise** | 8000/bln | Unlimited | Unlimited | Unlimited | Unlimited | ✅ |

### Room Roles (per room)
| Role | Akses |
|------|-------|
| **Owner** | Full control, billing, delete room |
| **Manager** | Edit room, hire NPC, place object |
| **Builder** | Dekorasi & layout saja |
| **Viewer** | Lihat saja (guest link) |

Jumlah role yang bisa ditambah = tergantung tier.

---

## 🏠 TIPE RUANGAN (Room Templates)

Setiap tipe punya layout awal, NPC default, dan object preset.

| Tipe | Icon | Deskripsi | Use Case | Kapasitas Base |
|------|------|-----------|----------|----------------|
| **Office** | 🏢 | Kantor profesional, meja, meeting room | Tim kerja, agensi | Standard |
| **Store** | 🛍️ | Toko virtual, etalase produk, kasir | E-commerce, UMKM | +20% object |
| **Academy** | 🎓 | Kelas, papan tulis, kursi seminar | Kursus, training | +10 NPC |
| **Clinic** | 🏥 | Resepsionis, ruang tunggu, konsultasi | Layanan kesehatan | Standard |
| **Lounge** | 🛋️ | Ruang casual, komunitas, networking | Komunitas, events | +30 member |
| **Restaurant** | 🍕 | Meja makan, dapur, counter | F&B, hospitality | Standard |
| **Custom** | ⚙️ | Mulai dari blank canvas | Advanced user | Tier-dependent |

---

## 🤖 NPC MARKETPLACE

### Kategori NPC

```
NPC
├── AI Agent (punya LLM + Skills)
│   ├── Sales Agent — greet, pitch, handle objection
│   ├── Support Agent — FAQ, ticket, escalate
│   ├── Content Creator — write, generate, schedule
│   ├── Researcher — search, summarize, report
│   └── Custom Agent — user bisa set sendiri via prompt
│
├── Receptionist (LLM only, no skills)
│   └── Default skill: "ngobrol" via LLM prompt saja
│       → User bisa customize personality, bahasa, topic
│
└── Character (no LLM — pure decoration/static)
    ├── Aksesori / pajangan
    ├── Figurin branded
    └── NPC ambient (berjalan, animasi saja)
```

### NPC Properties (customizable by user)
- **Tampilan**: warna kulit, rambut, outfit, aksesori, gender expression
- **Nama & Personality**: nama, catchphrase, gaya bicara
- **Skills**: list plugin yang di-assign
- **Position**: tile (x,y) di room
- **Schedule**: jam aktif/offline
- **Trigger**: klik objek → NPC muncul dan bicara

### Pricing NPC di Marketplace
| Jenis | Harga |
|-------|-------|
| NPC Blank (tanpa skill) | Gratis |
| NPC + LLM saja | 50 IX one-time |
| NPC + 1 Skill | 100–300 IX |
| NPC + Bundle Skills | 500–2000 IX |
| Custom NPC (admin buat) | Request ke Fahmi |

---

## 🪑 OBJECT MARKETPLACE

### Kategori Object
```
Object
├── Furniture (pure decoration, null function)
│   └── Meja, kursi, sofa, lampu, tanaman, rak...
│
├── Interactive Object (punya function)
│   ├── 💬 Chat Portal   → klik → start chat dengan NPC tertentu
│   ├── 📋 Form Widget   → klik → isi form (survey, order, booking)
│   ├── 🌐 Link Portal   → klik → redirect ke URL eksternal
│   ├── 📊 Data Board    → tampil data/stats real-time dari API
│   ├── 🎵 Audio Zone    → area dengan background sound/music
│   ├── 📹 Video Wall    → embed video/stream
│   ├── 🛒 Product Card  → tampil produk + beli via Ixonomic
│   └── ⚙️ Null Function → user pasang fungsi sendiri via code/webhook
│
└── Tile & Wall
    └── Lantai, tembok, partisi, jendela, pintu
```

### Object Properties
- **Model**: pilih model 3D dari katalog
- **Warna/Material**: customizable
- **Posisi**: drag & drop di room
- **Function**: null atau dari library
- **Trigger event**: onClick, onProximity, onHover

---

## 💰 IXONOMIC WALLET INTEGRATION

### Flow Lengkap
```
User belum punya wallet Ixonomic
  → Tampil modal "Hubungkan Dompet"
  → Tombol "Daftar Ixonomic" → redirect ixonomic.com/register?ref=mighan&callback=mighan.com/wallet/callback
  → Setelah register → auto redirect balik + connect

User sudah punya wallet
  → "Connect Wallet" → OAuth/API key exchange
  → Balance tampil di header dashboard setiap halaman
  → Top-up: redirect ke ixonomic.com/topup?amount=xxx&callback=...

Transaksi
  → Semua payment di mighan.com debit dari Ixonomic balance
  → Receipt otomatis via email
  → History di /dashboard/wallet
```

### Balance Display
- Selalu tampil di PortalNav (pojok kanan) setelah wallet terhubung
- Format: `💰 2,450 IX`
- Click → buka /dashboard/wallet

### Coin = Ixonomic (IX)
- 1 IX = nilai yang ditentukan Ixonomic
- Semua pricing dalam IX (bukan IDR langsung)
- User top-up IX dulu, baru spend di Mighan

---

## 🛤️ USER FLOW OPTIMAL (Onboarding)

### Flow 1: New User (High Conversion Path)

```
1. Landing mighan.com
   → Hero: "Bangun Virtual Space-mu" + "Coba Playground →"
   
2. PLAYGROUND (no auth)
   → Masuk demo room langsung, no signup
   → Bisa coba: klik NPC, klik object, lihat chat, explore layout
   → Floating CTA: "Suka? Buat Room Sendiri — Gratis →"
   → Timer/engagement: setelah 2 menit muncul CTA lebih kuat
   
3. Register (jika klik CTA)
   → Email + password atau Google OAuth
   → OTP verify → langsung masuk Onboarding Wizard
   
4. ONBOARDING WIZARD (4 step)
   Step 1 — Pilih Tipe Room
   → 6 kartu visual (Office/Store/Academy/Clinic/Lounge/Restaurant)
   → Hover = preview screenshot room jadi
   → Klik = pilih, next
   
   Step 2 — Nama & Customize
   → Nama room (wajib)
   → Deskripsi singkat (opsional)
   → Pilih warna tema (opsional)
   
   Step 3 — Pilih Plan
   → Free: "Mulai Gratis" → langsung lanjut
   → Paid: "Connect Ixonomic Wallet" → redirect → balik
   → Konfirmasi bayar → debit IX → lanjut
   
   Step 4 — Room Dibuat! 🎉
   → Animasi success
   → Preview URL: room.mighan.com/AbCd1234
   → Tombol: "Masuk Room Sekarang →"
   
5. MASUK ROOM (room.mighan.com/{id})
   → First-time tutorial floating hints:
     "👋 Klik NPC untuk chat"
     "🪑 Klik + untuk tambah object"
     "👥 Hire agent dari Marketplace"
   → Side panel: Hire NPC | Dekorasi | Settings
```

### Flow 2: Returning User
```
mighan.com/login → Dashboard → List Rooms → Klik Room → room.mighan.com/{id}
```

---

## 📱 HALAMAN YANG PERLU DIBANGUN

### Priority 1 — Core (Wajib untuk launch)

| Halaman | Status | Deskripsi |
|---------|--------|-----------|
| `/playground` | 🔧 Upgrade | Sandbox interaktif full-featured, no auth |
| `/dashboard` | ✅ **Sprint 2 DONE** | Product dashboard: rooms grid, onboarding empty state, quick stats, IX balance, developer section collapsible |
| `/dashboard/rooms` | ✅ **Sprint 2 DONE** | Rooms list + create room |
| `/dashboard/rooms/{id}` | ✅ **Sprint 2 DONE** | Room management: NPCs tab, objects tab, settings, share |
| `/dashboard/marketplace` | ✅ **Sprint 2 DONE** | Browse 13 NPC + 15 objects, hire, search, category filter |
| `/dashboard/wallet` | ✅ **Sprint 2 DONE** | IX balance, top-up, transaction history, plans tabs |
| `/room/[roomId]` | ✅ **Sprint 2 DONE** | Room overview (2D) + 3D iframe view (ops.mighan.com) |
| `room.mighan.com/{id}` | ❌ Belum | Nginx wildcard subdomain routing ke /room/[roomId] |

### Priority 2 — Growth

| Halaman | Deskripsi |
|---------|-----------|
| `/marketplace/npcs` | Filter NPC by type, skill, price |
| `/marketplace/objects` | Filter by category, function |
| `/marketplace/skills` | Plugin/skill catalog |
| `/dashboard/rooms/{id}/roles` | Manage member roles |
| `/dashboard/rooms/{id}/workflows` | Visual SOP editor embed |
| `/dashboard/analytics` | Usage stats, engagement per room |

### Priority 3 — Monetization

| Halaman | Deskripsi |
|---------|-----------|
| `/pricing` | Public pricing page (bukan di dashboard) |
| `/dashboard/billing` | Invoice, subscription management |
| `/creator` | Jual NPC/object buatan sendiri ke marketplace |

---

## 🔧 BACKEND API YANG PERLU ADA

### Sudah ada (gateway) — Sprint 2:
- `/api/v1/rooms` CRUD ✅
- `/api/v1/rooms/{id}/state` GET (full room state untuk 3D render) ✅
- `/api/v1/rooms/{id}/npcs` POST/DELETE/PATCH ✅
- `/api/v1/rooms/{id}/objects` POST/DELETE ✅
- `/api/v1/assets/registry` (themes, NPC templates) ✅
- `/api/v1/auth/*` ✅
- `/api/v1/marketplace/npcs` GET (13 NPC dari global-registry.json) ✅
- `/api/v1/marketplace/objects` GET (15 objects dari global-registry.json) ✅
- `/api/v1/wallet/balance` GET (Ixonomic connector) ✅
- `/api/v1/wallet/history` GET (Transaction table) ✅
- `/api/v1/wallet/topup` POST (via Ixonomic connector) ✅

### Masih perlu ditambah:
```
/api/v1/rooms/{id}/roles          GET/POST/PUT/DELETE
/api/v1/rooms/{id}/settings       GET/PUT (sudah ada via rooms PUT)
/api/v1/rooms/{id}/workflows      GET/POST

/api/v1/marketplace/skills        GET (catalog)
/api/v1/marketplace/purchase      POST (payment flow)

/api/v1/wallet/connect            POST (store Ixonomic API key)
/api/v1/wallet/transactions       GET (alias untuk /history)
/api/v1/wallet/pay                POST (debit for room/NPC/object)

/api/v1/user/inventory            GET (all NPC + object owned user)
```

### Room Subdomain Routing:
```nginx
# Nginx config tambahan
server {
  server_name room.mighan.com;
  location ~* ^/([A-Za-z0-9]+)$ {
    proxy_pass http://localhost:3200/room/$1;
  }
}
```
Dan Next.js handle `/room/[roomId]` → load ops.mighan.com engine dalam iframe/embed.

---

## 🎨 PLAYGROUND SPEC (Priority 1)

Playground = demo room publik yang bisa diakses siapa saja tanpa login.

### Features:
- World 3D sudah terisi: 3 NPC demo, 5 object demo
- NPC bisa diklik → chat (LLM response)
- Object bisa diklik → lihat fungsinya
- Sidebar kiri: panel "Hire NPC", "Tambah Object", "Dekorasi"
- Semua action = DEMO ONLY, tidak tersimpan
- Floating banner: "Ini adalah demo. Buat room kamu sendiri →"
- Analytics: track apa yang user klik (untuk optimize conversion)

### Conversion triggers:
- Setelah 90 detik → popup "Suka? Sign up gratis →"
- Setelah hire NPC pertama kali → "Mau yang ini jadi milikmu? Daftar →"
- Setelah chat 3x dengan NPC → "Buat AI agent sendiri →"

---

## 🗺️ ROADMAP SPRINT

### Sprint 1 — Foundation (1-2 minggu)
**Goal:** User bisa buat room + masuk ke room.mighan.com/{id}

- [ ] Nginx subdomain `room.mighan.com`
- [ ] Next.js `/room/[roomId]` page — embed ops.mighan.com engine
- [ ] Room state loading: `GET /api/v1/rooms/{id}` → apply theme + NPCs
- [ ] Onboarding wizard upgrade (4 step fullscreen)
- [ ] Dashboard/rooms/{id} — room detail page

### Sprint 2 — Marketplace (2-3 minggu)
**Goal:** User bisa hire NPC dan beli object

- [ ] `/api/v1/marketplace/npcs` — catalog 10+ NPC templates
- [ ] `/api/v1/marketplace/objects` — catalog 20+ object types
- [ ] `/dashboard/marketplace` page
- [ ] NPC hire flow: browse → preview → beli (IX) → assign ke room
- [ ] Object buy flow: browse → preview → beli → place di room
- [ ] In-room: drag & drop NPC/object placement
- [ ] NPC customization panel (tampilan + skill)

### Sprint 3 — Wallet & Monetization (1-2 minggu)
**Goal:** Semua transaksi pakai Ixonomic

- [ ] Ixonomic wallet connect flow
- [ ] Balance display di PortalNav
- [ ] `/api/v1/wallet/*` endpoints
- [ ] Payment gate untuk room creation (paid tiers)
- [ ] `/dashboard/wallet` real (bukan stub)
- [ ] Transaction history
- [ ] Subscription management

### Sprint 4 — Playground + Growth (1 minggu)
**Goal:** Demo page yang convert

- [ ] `/playground` upgrade: full interactive demo
- [ ] Pre-populated demo room dengan NPC + object menarik
- [ ] Conversion triggers (popup at 90s, post-hire, post-chat)
- [ ] Analytics event tracking (Posthog/Umami)
- [ ] Share room link: `room.mighan.com/{id}?guest=1`
- [ ] Room embed code (`<iframe>` untuk di-embed di website lain)

### Sprint 5 — Polish & Roles (1 minggu)
**Goal:** Multi-user per room

- [ ] Role management UI (Manager, Builder, Viewer)
- [ ] Invite link per room
- [ ] In-room tutorial (first-time hints)
- [ ] Room analytics (visitor count, NPC interactions)
- [ ] Mobile responsive dashboard

---

## 💡 INOVASI BARU (dari analisis)

### 1. Room Embed (viral growth)
```html
<!-- User bisa pasang ini di website mereka -->
<iframe src="room.mighan.com/{id}?embed=1" width="800" height="600" />
```
→ Visitor website client bisa langsung chat dengan NPC agent
→ Setiap embed = backlink + awareness untuk Mighantect

### 2. NPC Cloning
User bisa "fork" NPC dari marketplace → sesuaikan sendiri → simpan sebagai NPC pribadi.  
Opsional: upload ke marketplace dan jual ke user lain (revenue sharing 70/30).

### 3. Room Template Sharing
User bisa export room config sebagai template → share ke teman → atau jual di marketplace.

### 4. Room Analytics
Per room: berapa visitor, berapa chat NPC, object mana yang paling diklik, peak hours.  
→ Data ini berharga untuk user optimasi room mereka.

### 5. AI Room Advisor
Setelah 7 hari, Iris engine analisa usage room → kirim notifikasi:  
_"Room-mu banyak dikunjungi tapi NPC-nya jarang diklik. Coba repositioning Sari ke dekat pintu masuk."_

### 6. Workflow Builder in Dashboard
Visual SOP editor (sudah ada di ops.mighan.com) → embed di dashboard.  
User bisa set: "Kalau ada yang klik kursi merah → trigger NPC Budi → kirim email"

---

## 📊 CONVERSION METRICS (target)

| Metric | Target awal |
|--------|-------------|
| Playground → Register | >15% |
| Register → Room Created | >80% |
| Room Created → First NPC Hired | >60% |
| Free → Paid upgrade | >10% dalam 30 hari |
| Monthly Churn | <5% |

---

## 🚫 ANTI-PATTERNS (jangan dilakukan)

1. **Jangan paksa buat akun sebelum playground** — friction killer terbesar
2. **Jangan tampilkan pricing dulu sebelum user merasakan value**
3. **Jangan buat onboarding terlalu panjang** — max 4 step, tiap step <30 detik
4. **Jangan hardcode harga dalam IDR** — semua dalam IX (flexible)
5. **Jangan isolate Ixonomic wallet** — tampilkan balance di SETIAP halaman portal
6. **Jangan biarkan room kosong** — auto-populate template NPC + object saat room baru dibuat

---

## 🔑 KEPUTUSAN TEKNIS KRITIS

### Subdomain `room.mighan.com`
- Option A: **Wildcard subdomain** → semua `*.mighan.com` ke same server, Next.js detect subdomain
- Option B: **Path-based** → `mighan.com/room/{id}` (lebih mudah, kurang prestisius)
- **Rekomendasi: Option A** — lebih premium, mudah share, user impressed

### Ixonomic API
Butuh dari tim ixonomic.com:
- `GET /api/balance?userId=xxx` → balance user
- `POST /api/transfer` → debit dari wallet user ke merchant Mighan
- OAuth flow untuk connect wallet
- Webhook untuk konfirmasi payment

### Room State Storage (DB Schema)
```sql
rooms: id, userId, name, theme, roomType, subdomain, isActive
room_npcs: id, roomId, npcTemplateId, name, position, appearance (JSON), skills (JSON)
room_objects: id, roomId, objectTemplateId, position, rotation, function (JSON)
room_members: id, roomId, userId, role, invitedAt
room_analytics: roomId, visitorCount, interactionCount, date
marketplace_items: id, type (npc|object|skill), name, price, metadata
user_inventory: userId, itemId, purchasedAt
```

---

## 📝 HANDOFF NOTES UNTUK AGENT BERIKUTNYA

**Baca dulu:** `docs/AGENT_CONTINUITY.md` → current focus (updated per sesi).

---

### STATUS SPRINT 1 (update 2026-04-30)

| Task | Status | Notes |
|------|--------|-------|
| `docs/SAAS_PRODUCT_VISION.md` | ✅ Done | Committed + pushed |
| `app/room/[roomId]/page.tsx` | ✅ Done | 2D overview + 3D iframe mode, graceful fallback |
| `GET /api/v1/rooms/:id/state` | ✅ Done | Sudah ada di `server/routes/room.js` |
| Rooms page → internal `/room/{id}` | ✅ Done | Tidak lagi langsung ke ops.mighan.com |
| Deploy VPS PM2 id 25 | ✅ Done | Online, 0 crash cycle |
| Nginx wildcard `room.mighan.com` | 🔧 Pending | Perlu aaPanel + DNS record |
| `ops.mighan.com/room-viewer` page | 🔧 Pending | DNS ke Cloudflare — origin unknown |
| `/dashboard/rooms/{id}` management | 🔧 Pending | Sprint 2 |
| Onboarding wizard 4-step | 🔧 Pending | Sprint 2 |
| Ixonomic wallet connect | 🔧 Pending | Sprint 3 |

---

### ARSITEKTUR FINAL (dikonfirmasi Fahmi 2026-04-30)

```
ops.mighan.com       = Global engine inventory (Three.js + all assets)
                       ADMIN-ONLY direct access (Fahmi + dev)
                       Serve /room-viewer?roomId=X&token=Y&mode=user
                       untuk iframe dari Next.js room page

room.mighan.com/{id} = Next.js /room/[roomId] page
                       → Auth check (JWT localStorage)
                       → Fetch room state: GET /api/v1/rooms/{id}/state
                       → 2D Overview tab (NPC list, objects, slot bars)
                       → 3D World tab → iframe ke ops.mighan.com/room-viewer
                       → Graceful fallback jika iframe gagal

mighan.com           = SaaS portal (landing, auth, dashboard)
ixonomic.com         = Wallet coin system (external)
```

### PRIORITAS SPRINT 2 (belum dikerjakan)

1. **`ops.mighan.com/room-viewer`** — buat halaman HTML standalone yang load Three.js engine dalam user mode. Terima `?roomId=X&token=Y&mode=user`, fetch room state dari gateway, render 3D room tanpa admin panels. File: `web-mighan/room-viewer.html` di Mighan-3D project, lalu deploy ke ops.mighan.com.
2. **Nginx wildcard** — tambah `*.mighan.com` DNS + nginx config sehingga `room.mighan.com` → Next.js.
3. **`/dashboard/rooms/{id}`** — room management detail page: edit theme, manage NPCs, manage objects, share link.
4. **Marketplace stub** — `/dashboard/marketplace` page: catalog NPC + object templates (mock data dulu).
5. **Onboarding wizard upgrade** — 4 step fullscreen: choose room type → name room → connect wallet → enter room.

### JANGAN MULAI SPRINT 3 sebelum:
- room.mighan.com/{id} bisa dibuka di browser dan tampilkan room info
- NPC dan object bisa ditambah ke room via dashboard

### Design rules (TETAP berlaku):
- `app/page.tsx`, `components/Sidebar.tsx`, `app/globals.css` → TERKUNCI (sidebar putih landing page)
- Setiap UI baru portal/dashboard → dark theme (#0d0d1a bg)
- `localStorage` HANYA dalam `useEffect` atau event handler — tidak pernah di render/module level
- getHeaders() selalu di dalam component body, bukan module level
