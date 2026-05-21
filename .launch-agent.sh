#!/bin/bash
cd "$(dirname "$0")"
exec claude "$(cat .agent-prompt.txt)"
