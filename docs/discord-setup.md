# Discord Webhook Setup

PR notifications are sent by **GitHub Actions** when a PR is opened or merged into `main`. Agents do not call Discord locally.

---

## Step 1 — Create a channel

1. Open Discord
2. In your server (or create a personal one), right-click the channel list → **Create Channel**
3. Name it `#atmos-agents` (text channel)

## Step 2 — Create the webhook

1. Click the gear icon next to `#atmos-agents` → **Edit Channel**
2. Go to **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Name it "Atmos" (optional: upload the atmos logo as avatar)
5. Click **Copy Webhook URL**

The URL looks like:
```
https://discord.com/api/webhooks/1234567890/abcdefghijklmnop...
```

## Step 3 — Add GitHub secret (required for PR notifications)

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `DISCORD_WEBHOOK_URL`
4. Value: your webhook URL from Step 2

Workflow: `.github/workflows/discord-pr.yml`

If the secret is missing, the workflow skips quietly.

## Step 4 — Optional: local test script

For manual testing only, you can add the same URL to `.env.local`:

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
```

```bash
./scripts/discord-notify.sh "Test notification from atmos-web" 3066993 "TEST" "main"
```

---

## What gets notified

| Event | Trigger | Color |
|-------|---------|-------|
| **PR opened** | PR opened/reopened targeting `main` | Blue |
| **PR merged** | PR merged into `main` | Green |

Each embed includes: PR link, branch, task ID (`T003` from branch or title), author (open) or merger (merge).

Task ID is parsed from `feat/T003-app-layout` or `feat(T003): ...` in the title.

---

## No Discord?

Agents and CI still work; you simply won't get channel notifications until `DISCORD_WEBHOOK_URL` is set in GitHub Actions secrets.
