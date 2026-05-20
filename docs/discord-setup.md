# Discord Webhook Setup

Agents use Discord to notify you when a task starts, completes, or is blocked.

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

## Step 3 — Add to .env.local

```bash
# atmos-web/.env.local
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
```

## Step 4 — Test it

```bash
./scripts/discord-notify.sh "Test notification from atmos-web" 3066993 "TEST" "main"
```

You should see a blue embed appear in `#atmos-agents`.

---

## What the notifications look like

- **Task started:** agent begins working on T004
- **Task completed:** PR opened, link included
- **Task blocked:** agent hit a blocker, needs your input

---

## No Discord?

The scripts fail silently if `DISCORD_WEBHOOK_URL` is not set — agents still work, you just won't get notifications.
