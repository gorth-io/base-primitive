#!/usr/bin/env bash
set -euo pipefail

TOKEN="595baad972d13eacd5209e301aff799b767cd23571334c8f124fab8040edb1e7"

URLS=(
  "https://www.shadcn.io/r/aurora.json?token=${TOKEN}"
  "https://www.shadcn.io/r/beams.json?token=${TOKEN}"
  "https://www.shadcn.io/r/beams-collision.json?token=${TOKEN}"
  "https://www.shadcn.io/r/bokeh.json?token=${TOKEN}"
  "https://www.shadcn.io/r/boxes.json?token=${TOKEN}"
  "https://www.shadcn.io/r/bubble.json?token=${TOKEN}"
  "https://www.shadcn.io/r/circles.json?token=${TOKEN}"
  "https://www.shadcn.io/r/confetti.json?token=${TOKEN}"
  "https://www.shadcn.io/r/constellation.json?token=${TOKEN}"
  "https://www.shadcn.io/r/dot-pattern.json?token=${TOKEN}"
  "https://www.shadcn.io/r/fireflies.json?token=${TOKEN}"
  "https://www.shadcn.io/r/fireworks.json?token=${TOKEN}"
  "https://www.shadcn.io/r/flickering-grid.json?token=${TOKEN}"
  "https://www.shadcn.io/r/fog.json?token=${TOKEN}"
  "https://www.shadcn.io/r/glitch.json?token=${TOKEN}"
  "https://www.shadcn.io/r/gradient.json?token=${TOKEN}"
  "https://www.shadcn.io/r/gradient-animation.json?token=${TOKEN}"
  "https://www.shadcn.io/r/grid-pattern.json?token=${TOKEN}"
  "https://www.shadcn.io/r/hexagon.json?token=${TOKEN}"
  "https://www.shadcn.io/r/interactive-grid-pattern.json?token=${TOKEN}"
  "https://www.shadcn.io/r/light-waves.json?token=${TOKEN}"
  "https://www.shadcn.io/r/magnetic-field.json?token=${TOKEN}"
  "https://www.shadcn.io/r/matrix.json?token=${TOKEN}"
  "https://www.shadcn.io/r/mesh-gradient.json?token=${TOKEN}"
  "https://www.shadcn.io/r/meteors.json?token=${TOKEN}"
  "https://www.shadcn.io/r/neon.json?token=${TOKEN}"
  "https://www.shadcn.io/r/orbits.json?token=${TOKEN}"
  "https://www.shadcn.io/r/particles.json?token=${TOKEN}"
  "https://www.shadcn.io/r/paths.json?token=${TOKEN}"
  "https://www.shadcn.io/r/rain.json?token=${TOKEN}"
  "https://www.shadcn.io/r/retro-grid.json?token=${TOKEN}"
  "https://www.shadcn.io/r/ripple.json?token=${TOKEN}"
  "https://www.shadcn.io/r/shooting-stars.json?token=${TOKEN}"
  "https://www.shadcn.io/r/snow.json?token=${TOKEN}"
  "https://www.shadcn.io/r/sparkles.json?token=${TOKEN}"
  "https://www.shadcn.io/r/spotlight.json?token=${TOKEN}"
  "https://www.shadcn.io/r/starfield.json?token=${TOKEN}"
  "https://www.shadcn.io/r/topography.json?token=${TOKEN}"
  "https://www.shadcn.io/r/underwater.json?token=${TOKEN}"
  "https://www.shadcn.io/r/vortex.json?token=${TOKEN}"
  "https://www.shadcn.io/r/warp.json?token=${TOKEN}"
  "https://www.shadcn.io/r/wave-grid.json?token=${TOKEN}"
  "https://www.shadcn.io/r/wavy.json?token=${TOKEN}"
  "https://www.shadcn.io/r/background.json?token=${TOKEN}"
)

VALID_URLS=()
for registry_url in "${URLS[@]}"; do
  if curl -fsS "$registry_url" >/dev/null 2>&1; then
    VALID_URLS+=("$registry_url")
  fi
done

if [[ ${#VALID_URLS[@]} -eq 0 ]]; then
  echo "No authorized background items could be resolved with your token."
  exit 1
fi

echo "Resolved ${#VALID_URLS[@]} installable backgrounds from hardcoded list."
if [[ ${#URLS[@]} -ne 44 ]]; then
  echo "Warning: hardcoded list is ${#URLS[@]} items, not 44."
fi

pnpm dlx shadcn@latest add -o -p src/components/background "${VALID_URLS[@]}"
