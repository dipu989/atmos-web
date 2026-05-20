.PHONY: dev build lint test e2e check agent clean-agent setup seed-user

# ── Development ───────────────────────────────────────────────────────────────
dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

test:
	pnpm test

test-watch:
	pnpm test --watch

e2e:
	pnpm e2e

# Full pre-PR check (same as CI)
check:
	pnpm lint && pnpm build && pnpm test

# ── Agentic Workflow ──────────────────────────────────────────────────────────
# Spin up a new agent for a task: make agent TASK=T004
agent:
	@if [ -z "$(TASK)" ]; then echo "Usage: make agent TASK=T004"; exit 1; fi
	./scripts/new-agent.sh $(TASK)

# List all available tasks with status
tasks:
	@echo "\nAvailable Tasks:\n"
	@for f in tasks/T*.md; do \
		task=$$(basename $$f .md); \
		if grep -q "Status: Done" $$f 2>/dev/null; then \
			echo "  ✅ $$task"; \
		elif grep -q "Status: In Progress" $$f 2>/dev/null; then \
			echo "  🔄 $$task"; \
		elif grep -q "## Blockers" $$f 2>/dev/null && grep -A1 "## Blockers" $$f | grep -q "[a-zA-Z]"; then \
			echo "  🚫 $$task (blocked)"; \
		else \
			echo "  ⬜ $$task"; \
		fi; \
	done
	@echo ""

# Clean up worktree after PR merged: make clean-agent TASK=T004
clean-agent:
	@if [ -z "$(TASK)" ]; then echo "Usage: make clean-agent TASK=T004"; exit 1; fi
	./scripts/cleanup-worktree.sh $(TASK)

# ── Backend ───────────────────────────────────────────────────────────────────
# Start atmos-core backend
backend:
	cd ../atmos-core && make dev

# Create test user in backend
seed-user:
	@echo "Creating test user..."
	curl -s -X POST http://localhost:8081/api/v1/auth/register \
		-H "Content-Type: application/json" \
		-d '{"display_name":"Shantnu","email":"shantnu@atmos.app","password":"Test1234!"}' | python3 -m json.tool
	@echo "\n✅ Test user created: shantnu@atmos.app"

# ── Setup ─────────────────────────────────────────────────────────────────────
setup:
	pnpm install
	@echo "✅ Dependencies installed"
	@echo "📋 Next: cp .env.example .env.local and add DISCORD_WEBHOOK_URL"

help:
	@echo ""
	@echo "  atmos-web — Development Commands"
	@echo "  ─────────────────────────────────────────────────"
	@echo "  make dev              Start dev server (localhost:3000)"
	@echo "  make build            Production build"
	@echo "  make lint             ESLint check"
	@echo "  make test             Vitest unit tests"
	@echo "  make check            Full pre-PR check (lint + build + test)"
	@echo ""
	@echo "  make agent TASK=T004  Launch agent for a task in new terminal"
	@echo "  make tasks            List all tasks with status"
	@echo "  make clean-agent TASK=T004  Remove worktree after PR merge"
	@echo ""
	@echo "  make backend          Start atmos-core backend"
	@echo "  make seed-user        Create test user in backend"
	@echo ""
