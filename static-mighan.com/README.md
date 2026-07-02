# static-mighan.com — backup of the live static site (DESIGN-LOCKED)

Isi folder ini = mirror dari `/www/wwwroot/mighan.com/` di VPS 72.62.125.6
(di-backup 2026-07-02 saat git↔live reconcile — sebelumnya file live ini
TIDAK ada di git manapun; kalau VPS hilang, site hilang).

- ⛔ **DESIGN LOCK** (CLAUDE.md Mighan-3D): sidebar putih Mighantect — dilarang
  ubah layout/nav/warna tanpa izin eksplisit Fahmi, dilarang deploy ulang tanpa instruksi.
- `world-lite/` TIDAK ikut di sini — canonical-nya `C:\Mighan-3D\world-lite\`
  (repo mighantect-3d), deploy target `/www/wwwroot/mighan.com/world-lite/`.
- nginx `mighan.com.conf` menyerve `/world-lite/` (alias) dari dir VPS itu;
  route `/` mighan.com diserve Next.js app (repo ini) via proxy :3200.
- Kalau perlu restore: scp isi folder ini ke `/www/wwwroot/mighan.com/`.
