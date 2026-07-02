---
name: mighan-deploy
description: Deploy & operate mighan.com on the SHARED VPS (72.62.125.6, same box as MiganCore). Use for ANY mighan.com change — the static landing, the Next.js app (PM2 mighan-web :3200), or the 3D gateway (PM2 gateway :9797). Read BEFORE editing/deploying so you touch the right piece and never clobber MiganCore or the other tenants.
---

# mighan.com Deploy & Ops (shared VPS)

mighan.com lives on the SAME box as MiganCore (`/opt/ado`), Ixonomic, SIDIX, MighanWorld — 5+ tenants on one Hostinger KVM (root@72.62.125.6, hostname `mix`). The #1 rule: **stay inside mighan's own files/processes; never touch `/opt/ado` (MiganCore) or kill shared daemons.** Verified live 2026-06-25.

## Access
```bash
ssh -i ~/.ssh/sidix_session_key -o StrictHostKeyChecking=no root@72.62.125.6
```
Key: `~/.ssh/sidix_session_key`. Secrets → `/opt/secrets/mighan/` (mode 600) — NEVER in git or chat.

## mighan.com has THREE separate pieces — know which one you're changing
| Piece | Where (VPS) | Served by | Repo (branch) |
|------|-------------|-----------|---------------|
| **A. Static landing** (index.html, css/, js/, assets/) | `/www/wwwroot/mighan.com` | nginx static `root` (no build, no PM2) | (files on box; some `.bak` snapshots present) |
| **B. Next.js app** (PM2 `mighan-web`) | `/www/wwwroot/mighan-next` | nginx `/` + `/_next/static/` → `127.0.0.1:3200` | `github.com/fahmiwol/mighan-web.git` (**master**, HTTPS) |
| **C. 3D gateway / API** (PM2 `gateway`) | `/root/mighantect-3d` (script `server/gateway.js`, cwd `server/`) | nginx `/api/` + `ops.mighan.com` → `127.0.0.1:9797` | `github.com/fahmiwol/mighantect-3d.git` (**main**, SSH) |

⚠️ Naming trap: the **Next.js app is in `/www/wwwroot/mighan-next`** (package name `mighan-web`, PM2 `mighan-web`), NOT in `/www/wwwroot/mighan.com` (that dir is the plain static site). Editing the wrong one = "my change doesn't show up."

nginx vhosts: `/www/server/panel/vhost/nginx/mighan.com.conf` and `ops.mighan.com.conf` (BT/aaPanel). `.env.local` in mighan-next: `NEXT_PUBLIC_API_URL=https://mighan.com`.

## Deploy workflows

### A. Static landing (`/www/wwwroot/mighan.com`)
Edit the file → nginx serves immediately. No build, no restart.
```bash
# after editing /www/wwwroot/mighan.com/<file>
curl -s -o /dev/null -w "%{http_code}\n" https://mighan.com/      # expect 200
```
Browser shows old version → hard-refresh (Ctrl-Shift-R); nginx may cache static.

### B. Next.js app (PM2 `mighan-web`, port 3200)
```bash
cd /www/wwwroot/mighan-next
git pull origin master                      # HTTPS remote → needs a GitHub PAT (store in /opt/secrets/mighan/)
nice -n 10 npm run build                     # build = "next build"; NICE IT (see CPU rule below)
pm2 restart mighan-web                        # runs "next start -p 3200"
pm2 logs mighan-web --lines 30 --nostream     # confirm clean boot
curl -s -o /dev/null -w "next :3200 -> %{http_code}\n" http://127.0.0.1:3200/
curl -s -o /dev/null -w "https://mighan.com -> %{http_code}\n" https://mighan.com/
```

### C. 3D gateway (PM2 `gateway`, port 9797)
```bash
cd /root/mighantect-3d
git pull origin main                          # SSH remote → needs a deploy key on the box
pm2 restart gateway
pm2 logs gateway --lines 30 --nostream
curl -s -o /dev/null -w ":9797 -> %{http_code}\n" http://127.0.0.1:9797/
curl -s -o /dev/null -w "https://ops.mighan.com -> %{http_code}\n" https://ops.mighan.com/
```
KNOWN ISSUE (2026-06-25): gateway's AI features (Iris/NPC) error out — Anthropic "credit balance too low", Gemini/`claude-haiku-4-5` model-id 404, an em-dash byte bug (char 8212 > 255), `this.ai.generateResponse is not a function`. The process stays up but those features are broken — fix the AI provider config/keys + model ids before relying on them.

## SAFETY — never break the neighbours (this is the whole point)
- 🚫 **NEVER touch `/opt/ado/`** — that's MiganCore's docker stack (ado-api/ollama/postgres/qdrant/redis). One wrong move kills the AI chat at app.migancore.com.
- 🚫 **NEVER `pkill -f ollama` / `pkill node`** — kills SIDIX's host Ollama and other tenants' PM2. Restart ONLY your own: `pm2 restart mighan-web` / `pm2 restart gateway`.
- 🚫 **NEVER `pm2 restart all` / `pm2 kill`** — 14 services share this PM2 (Ixonomic bank, gateways, etc.). Target by name only.
- ⚠️ **CPU contention is real:** `next build` can hit 600%+ CPU and starve MiganCore's CPU-only 7B inference (makes chat time out). Always `nice -n 10 npm run build`, build off-peak, and check first: `ps aux --sort=-%cpu | head -5`.
- ⚠️ **Ports already taken — pick a free one if you add a service:** 3200 (mighan-web), 9797 (gateway), 8642 (hermes/EMIGA — MiganCore side, leave it), 18000 (MiganCore brain), 3001/3003/3004/3006/3008/3013/3200 (Ixonomic). Check: `ss -tlnp`.
- 🔐 Secrets in `/opt/secrets/mighan/` only. mighan-web pushes over HTTPS (PAT), mighantect-3d over SSH (deploy key). Don't paste either in chat/commits.

## Pre-flight (run before any build/deploy)
```bash
df -h / | tail -1; free -h | head -2; ps aux --sort=-%cpu | head -5
docker compose -f /opt/ado/docker-compose.yml ps   # MiganCore healthy BEFORE you add load?
pm2 list                                            # baseline: what's online
```
If disk is tight or MiganCore is restarting, STOP and see the `migancore-vps-ops` skill first.

## Rollback
- Static: `.bak`/`.bak2` snapshots exist in `/www/wwwroot/mighan.com` — `cp index.html.bak index.html`.
- Next/gateway: `git -C <dir> log --oneline -5` then `git checkout <prev> -- <file>` (surgical) or `git reset --hard <prev>` (whole tree, careful) → rebuild/restart.
- PM2 keeps the last process; `pm2 restart <name>` re-runs current code. There's no auto-snapshot of the build — keep the previous `.next` if you want a fast revert.
```

Related: `migancore-vps-ops` (the box itself / rescue), `mighantect-onboarding` (the 3D repo internals).
