# Deploying atmos-web to Vercel

## Prerequisites
- GitHub repo pushed to `main`
- Vercel account at [vercel.com](https://vercel.com) (free tier is fine)
- Domain `atmosapp.dev` with DNS access at your registrar

---

## Step 1 — Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select the `atmos-web` repo from your GitHub account (`dipu989/atmos-web` or similar)
4. Vercel auto-detects Next.js — no framework config needed (`vercel.json` handles it)
5. Click **Deploy** — let it run once to confirm the build passes

---

## Step 2 — Set environment variables

After the first deploy, go to:
**Project → Settings → Environment Variables**

Add the following (select **Production** environment):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.atmosapp.dev` |
| `NEXT_PUBLIC_APP_URL` | `https://atmosapp.dev` |
| `NEXT_PUBLIC_APP_NAME` | `Atmos` |

Then go to **Deployments** and click **Redeploy** on the latest deployment so the env vars take effect.

---

## Step 3 — Add custom domain

1. Go to **Project → Settings → Domains**
2. Click **Add Domain**
3. Enter `atmosapp.dev` → click **Add**
4. Also add `www.atmosapp.dev` and set it to redirect to `atmosapp.dev`

Vercel will show you the DNS records to configure.

---

## Step 4 — Configure DNS at your registrar

Vercel gives you two options. Use **Option A** (recommended):

### Option A — Nameservers (easiest, Vercel manages everything)
Point your domain's nameservers to Vercel:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```
Go to your registrar (Namecheap / GoDaddy / Google Domains etc.) → Manage DNS → Change nameservers.

### Option B — A + CNAME records (keep your registrar's DNS)
Add these records at your registrar:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

---

## Step 5 — SSL

Vercel provisions a free Let's Encrypt SSL certificate automatically once DNS propagates (usually 5–30 minutes).

No action needed — `https://atmosapp.dev` will be live.

---

## Step 6 — Verify

Once DNS propagates, open `https://atmosapp.dev` in an incognito tab.

**Expected behaviour before backend is live:**
- ✅ Login page loads at `https://atmosapp.dev/login`
- ✅ Signup page loads
- ❌ Login attempt fails with network error (backend 503 — expected until AWS is fixed)

**After backend is live** (see [backend deployment checklist](#backend-env-vars)):
- ✅ Login works
- ✅ Dashboard loads with real data
- ✅ Google OAuth works end to end

---

## Backend env vars (apply when AWS is fixed)

Set these on your EC2 / ECS / environment in AWS:

```env
APP_ENV=production
APP_FRONTEND_URL=https://atmosapp.dev
CORS_ALLOW_ORIGIN=https://atmosapp.dev
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URL=https://api.atmosapp.dev/api/v1/auth/google/callback
```

Also add `https://api.atmosapp.dev/api/v1/auth/google/callback` as an **Authorized redirect URI** in Google Cloud Console:
- [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → your OAuth 2.0 Client ID → Authorized redirect URIs

---

## Auto-deploys

Once connected, every push to `main` triggers a Vercel deploy automatically. No manual steps needed going forward.
