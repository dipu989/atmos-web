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
REPO_ROOT="$(pwd)"
REPO_PARENT="$(cd "${REPO_ROOT}/.." && pwd)"
WORKTREE_PATH="${REPO_PARENT}/atmos-web-${TASK_ID}"

echo ""
echo "🤖 Launching agent for: $TASK_NAME"
echo "   Branch:   $BRANCH_NAME"
echo "   Worktree: $WORKTREE_PATH"
echo ""

# Create worktree (or attach to existing branch)
EXISTING_WORKTREE=$(git worktree list --porcelain | awk -v branch="$BRANCH_NAME" '
  /^worktree / { path=$2 }
  /^branch / && $2 ~ branch { print path }
' | head -1)

if [ -n "$EXISTING_WORKTREE" ]; then
  EXISTING_WORKTREE="$(cd "$EXISTING_WORKTREE" && pwd)"
fi

if [ -n "$EXISTING_WORKTREE" ] && [ "$EXISTING_WORKTREE" != "$WORKTREE_PATH" ]; then
  echo "❌ Branch $BRANCH_NAME is already checked out at: $EXISTING_WORKTREE"
  echo "   Run: git worktree remove '$EXISTING_WORKTREE' --force"
  echo "   Or:  make clean-agent TASK=${TASK_ID}"
  exit 1
fi

if [ -d "$WORKTREE_PATH" ]; then
  echo "⚠️  Worktree already exists at $WORKTREE_PATH — reusing"
elif git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}"; then
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
  echo "✅ Worktree created (existing branch)"
else
  git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME"
  echo "✅ Worktree created"
fi

# Copy context files (not committed yet)
cp -r "../.context" "$WORKTREE_PATH/../.context" 2>/dev/null || true

# Build initial prompt for agent — keep it short, agent reads files itself
PROMPT="Read CLAUDE.md, then read tasks/${TASK_NAME}.md and complete it fully. Only read context files listed in the task. When done: run pnpm build, pnpm lint, pnpm test — fix all errors. Then open a PR."

# Launch Claude in new terminal (macOS)
# Write prompt to a file — embedding multi-line markdown in AppleScript breaks quoting
PROMPT_FILE="${WORKTREE_PATH}/.agent-prompt.txt"
printf '%s\n' "$PROMPT" > "$PROMPT_FILE"

LAUNCHER="${WORKTREE_PATH}/.launch-agent.sh"
cat > "$LAUNCHER" << 'LAUNCHER_EOF'
#!/bin/bash
cd "$(dirname "$0")"
exec claude "$(cat .agent-prompt.txt)"
LAUNCHER_EOF
chmod +x "$LAUNCHER"

osascript <<APPLESCRIPT
tell application "Terminal"
  activate
  do script "'${LAUNCHER}'"
  set custom title of front window to "Agent: ${TASK_ID}"
end tell
APPLESCRIPT

echo ""
echo "✅ Agent launched in new Terminal window"
echo "📋 Monitor: Terminal window titled 'Agent: ${TASK_ID}'"
echo "🔔 Discord notifies on PR open/merge (GitHub Actions)"
