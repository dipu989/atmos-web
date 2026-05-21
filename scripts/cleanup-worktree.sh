#!/bin/bash
# Usage: ./scripts/cleanup-worktree.sh T004
# Removes the worktree after a task's PR has been merged.

set -euo pipefail

TASK_ID="${1:-}"
if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/cleanup-worktree.sh <TASK_ID>"
  exit 1
fi

WORKTREE_PATH="$(pwd)/../atmos-web-${TASK_ID}"

if [ ! -d "$WORKTREE_PATH" ]; then
  echo "⚠️  Worktree not found: $WORKTREE_PATH"
  exit 0
fi

echo "Removing worktree: $WORKTREE_PATH"
git worktree remove "$WORKTREE_PATH" --force
echo "✅ Worktree removed for $TASK_ID"
