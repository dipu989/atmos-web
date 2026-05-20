#!/bin/bash
# Usage: ./scripts/discord-notify.sh "message" "color_decimal"
# Colors: 3066993=green, 15158332=red, 3447003=blue, 16776960=yellow
#
# Requires DISCORD_WEBHOOK_URL in environment or .env.local
# Set it: export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."

set -euo pipefail

MESSAGE="${1:-Atmos agent update}"
COLOR="${2:-3447003}"
TASK_ID="${3:-}"
BRANCH="${4:-$(git branch --show-current 2>/dev/null || echo 'unknown')}"

# Load webhook URL from env or .env.local
if [ -z "${DISCORD_WEBHOOK_URL:-}" ]; then
  if [ -f ".env.local" ]; then
    export $(grep DISCORD_WEBHOOK_URL .env.local | xargs) 2>/dev/null || true
  fi
fi

if [ -z "${DISCORD_WEBHOOK_URL:-}" ]; then
  echo "⚠️  DISCORD_WEBHOOK_URL not set — skipping notification"
  exit 0
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPO="atmos-web"

PAYLOAD=$(cat <<JSONEOF
{
  "embeds": [{
    "title": "${MESSAGE}",
    "color": ${COLOR},
    "fields": [
      { "name": "Repo", "value": "${REPO}", "inline": true },
      { "name": "Branch", "value": "\`${BRANCH}\`", "inline": true },
      { "name": "Task", "value": "${TASK_ID:-N/A}", "inline": true }
    ],
    "timestamp": "${TIMESTAMP}"
  }]
}
JSONEOF
)

curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" > /dev/null

echo "✅ Discord notified: $MESSAGE"
