#!/usr/bin/env bash
set -euo pipefail

TOKEN="595baad972d13eacd5209e301aff799b767cd23571334c8f124fab8040edb1e7"

ITEMS=(
  "3d-card"
  "3d-marquee"
  "3d-pin"
  "android"
  "animated-beam"
  "animated-cursor"
  "animated-modal"
  "animated-testimonials"
  "animated-tooltip"
  "announcement"
  "apple-cards-carousel"
  "apple-hello-effect"
  "avatar-group"
  "banner"
  "calendar"
  "choicebox"
  "code-block"
  "code-editor"
  "code-tabs"
  "color-picker"
  "combobox"
  "comparison"
  "counter"
  "credit-card"
  "cursor"
  "dock"
  "dropzone"
  "gantt"
  "glimpse"
  "image"
  "image-crop"
  "image-zoom"
  "iphone-15-pro"
  "kanban"
  "kbd"
  "limelight-nav"
  "list"
  "mac-os-dock"
  "magnetic"
  "marquee"
  "menu-dock"
  "mini-calendar"
  "motion-highlight"
  "navbar"
  "pill"
  "pin-list"
  "pixel-image"
  "qr-code"
  "rating"
  "relative-time"
  "safari"
  "sandbox"
  "spinner"
  "status"
  "table"
  "tabs"
  "tags"
  "terminal"
  "text"
  "ticker"
)

if [ ${#ITEMS[@]} -eq 0 ]; then
  echo "No shadcn.io items provided."
  echo "Edit scripts/shadcn-io-list.sh and add slugs/URLs inside ITEMS=(...)."
  exit 0
fi

URLS=()
for item in "${ITEMS[@]}"; do
  if [[ "$item" =~ ^https://www\.shadcn\.io/r/.+\.json(\?.*)?$ ]]; then
    base="${item%%\?*}"
    URLS+=("${base}?token=${TOKEN}")
  else
    URLS+=("https://www.shadcn.io/r/${item}.json?token=${TOKEN}")
  fi
done

pnpm dlx shadcn@latest add -o -p src/components/io "${URLS[@]}"
