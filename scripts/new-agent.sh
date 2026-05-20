#!/bin/bash
# Usage: ./scripts/new-agent.sh T004
# Spins up a git worktree + launches Claude Code agent for a task.
# Each agent runs in isolation — no file conflicts with other agents.

set -euo pipefail

TASK_ID="${1:-}"
if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/new-agent.sh <TASK_ID>"
  echo "Example: ./scripts/new-agent.sh T004"
  echo ""
  echo "Available tasks:"
  ls tasks/*.md 2>/dev/null | xargs -I{} basename {} .md || echo "No task files found"
  exit 1
fi

# Find task file
TASK_FILE=$(ls tasks/${TASK_ID}*.md 2>/dev/null | head -1)
if [ -z "$TASK_FILE" ]; then
  echo "❌ Task file not found for: $TASK_ID"
  exit 1
fi

TASK_NAME=$(basename "$TASK_FILE" .md)
BRANCH_NAME="feat/${TASK_NAME}"
WORKTREE_PATH="$(pwd)/../../atmos-web-${TASK_ID}"
REPO_ROOT="$(pwd)"

echo ""
echo "🤖 Launching agent for: $TASK_NAME"
echo "   Branch:   $BRANCH_NAME"
echo "   Worktree: $WORKTREE_PATH"
echo ""

# Create worktree
if [ -d "$WORKTREE_PATH" ]; then
  echo "⚠️  Worktree already exists at $WORKTREE_PATH — reusing"
else
  git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME"
  echo "✅ Worktree created"
fi

# Copy context files (not committed yet)
cp -r "../.context" "$WORKTREE_PATH/../.context" 2>/dev/null || true

# Build initial prompt for agent
TASK_CONTENT=$(cat "$TASK_FILE")
PROMPT="You are working on the atmos-web project.

Read CLAUDE.md first for all project rules and conventions.
Then read ../../.context/api-spec.md for backend API reference.
Then read ../../.context/data-models.md for TypeScript types.
Then read ../../.context/auth-flow.md for auth patterns.
Then read ../../.context/design-system.md for UI patterns.
Then read the task file below and complete it fully.

Your task:
---
${TASK_CONTENT}
---

After completing:
1. Run: pnpm build (fix all errors before stopping)
2. Run: pnpm lint (fix all warnings)
3. Run: pnpm test (ensure tests pass)
4. Run: ./scripts/discord-notify.sh '✅ ${TASK_NAME} ready for QA' 3066993 '${TASK_ID}'"

# Notify Discord: agent starting
./scripts/discord-notify.sh "🚀 Agent started: **${TASK_NAME}**" 3447003 "$TASK_ID" "$BRANCH_NAME" 2>/dev/null || true

# Launch Claude in new terminal (macOS)
osascript <<APPLESCRIPT
tell application "Terminal"
  activate
  set newTab to do script "cd '${WORKTREE_PATH}' && claude '${PROMPT//\'/\\'\''}'"
  set custom title of front window to "Agent: ${TASK_ID}"
end tell
APPLESCRIPT

echo ""
echo "✅ Agent launched in new Terminal window"
echo "📋 Monitor: Terminal window titled 'Agent: ${TASK_ID}'"
echo "🔔 Discord will notify when QA-ready"
