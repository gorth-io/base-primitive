#!/usr/bin/env bash
set -euo pipefail

TOKEN="595baad972d13eacd5209e301aff799b767cd23571334c8f124fab8040edb1e7"

URLS=(
  "https://www.shadcn.io/r/use-boolean.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-click-anywhere.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-copy-to-clipboard.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-countdown.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-counter.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-dark-mode.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-debounce-callback.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-debounce-value.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-document-title.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-event-callback.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-event-listener.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-hover.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-intersection-observer.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-interval.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-is-client.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-is-mounted.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-isomorphic-layout-effect.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-local-storage.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-map.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-media-query.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-mouse-position.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-on-click-outside.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-read-local-storage.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-resize-observer.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-screen.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-script.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-scroll-lock.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-session-storage.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-step.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-ternary-dark-mode.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-timeout.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-toggle.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-unmount.json?token=${TOKEN}"
  "https://www.shadcn.io/r/use-window-size.json?token=${TOKEN}"
  "https://www.shadcn.io/r/hooks.json?token=${TOKEN}"
)

VALID_URLS=()
for registry_url in "${URLS[@]}"; do
  if curl -fsS "$registry_url" >/dev/null 2>&1; then
    VALID_URLS+=("$registry_url")
  fi
done

if [[ ${#VALID_URLS[@]} -eq 0 ]]; then
  echo "No authorized hooks could be resolved with your token."
  exit 1
fi

echo "Resolved ${#VALID_URLS[@]} installable hooks from hardcoded list."
if [[ ${#URLS[@]} -ne 35 ]]; then
  echo "Warning: hardcoded list is ${#URLS[@]} items, not 35."
fi

pnpm dlx shadcn@latest add -o -p src/hooks "${VALID_URLS[@]}"
