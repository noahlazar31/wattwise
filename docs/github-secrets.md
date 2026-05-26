# GitHub Actions — Required Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret**
in your GitHub repo and add each of the following:

---

## Supabase (migration workflow)

| Secret | Where to find it |
|--------|-----------------|
| `SUPABASE_ACCESS_TOKEN` | supabase.com → Account → Access tokens → Generate new token |
| `SUPABASE_PROJECT_ID` | Project settings → General → Reference ID (e.g. `abcdefghijklmnop`) |
| `SUPABASE_DB_URL` | Project settings → Database → Connection string → URI (starts with `postgresql://`) |
| `SUPABASE_DB_PASSWORD` | Same page — the password you set when creating the project |
| `SUPABASE_URL` | Project settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Project settings → API → anon / public key |

---

## Anthropic

| Secret | Where to find it |
|--------|-----------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

---

## Railway (backend deploy)

| Secret | Where to find it |
|--------|-----------------|
| `RAILWAY_TOKEN` | railway.app → Account Settings → Tokens → Create token |

> **One-time setup:** Before the GitHub Action can deploy, create the Railway project manually once:
> 1. railway.app → New Project → Deploy from GitHub → select `wattwise` → set root to `backend/`
> 2. Name the service `wattwise-backend`
> 3. The workflow will handle all future deploys and env var syncing automatically.

---

## Vercel (frontend deploy)

| Secret | Where to find it |
|--------|-----------------|
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Run `vercel whoami` or check `.vercel/project.json` after first link |
| `VERCEL_PROJECT_ID` | Same — run `vercel link` in `frontend/` once, then read `.vercel/project.json` |
| `NEXT_PUBLIC_API_URL` | Your Railway backend URL, e.g. `https://wattwise-backend.up.railway.app` |
| `FRONTEND_URL` | Your Vercel URL, e.g. `https://wattwise.vercel.app` (used by backend CORS) |

> **One-time setup for Vercel IDs:**
> ```bash
> cd frontend
> npx vercel link   # follow prompts, creates .vercel/project.json
> cat .vercel/project.json
> ```
> Copy `orgId` → `VERCEL_ORG_ID` and `projectId` → `VERCEL_PROJECT_ID`.
> Do NOT commit `.vercel/` — it's already in `.gitignore`.

---

## Summary checklist

- [ ] `SUPABASE_ACCESS_TOKEN`
- [ ] `SUPABASE_PROJECT_ID`
- [ ] `SUPABASE_DB_URL`
- [ ] `SUPABASE_DB_PASSWORD`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `RAILWAY_TOKEN`
- [ ] `VERCEL_TOKEN`
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_PROJECT_ID`
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `FRONTEND_URL`
