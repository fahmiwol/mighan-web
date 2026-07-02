# world-lite — REMOVED (dead shadowed copy)

Copy world-lite yang dulu ada di sini TIDAK PERNAH diserve:
nginx `mighan.com.conf` punya `location ^~ /world-lite/ { alias /www/wwwroot/mighan.com/world-lite/; }`
yang meng-intercept semua request sebelum sampai ke Next.js public/.

- **Canonical source:** `C:\Mighan-3D\world-lite\` (repo mighantect-3d, branch main)
- **Deploy target live:** `/www/wwwroot/mighan.com/world-lite/` di VPS 72.62.125.6
- Copy di sini sudah drift/basi (ketinggalan `placeModelUrl` prompt→3D dll) — dihapus 2026-07-02
  sesuai standing rule no-duplicate-deployments (ECOSYSTEM_ROADMAP.md §4).

Jangan tambahkan lagi copy world-lite di repo ini. Kalau butuh update world-lite,
edit di Mighan-3D lalu deploy ke static dir di atas.
