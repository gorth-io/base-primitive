#!/usr/bin/env bash
set -euo pipefail

COMPONENTS=(
  # "button"
  # "input"
  # "dialog"
)

if [ ${#COMPONENTS[@]} -eq 0 ]; then
  echo "No UI components provided."
  echo "Edit scripts/shadcn-ui-list.sh and add names inside COMPONENTS=(...)."
  exit 0
fi

pnpm dlx shadcn@latest add -o -p src/components/ui "${COMPONENTS[@]}"
