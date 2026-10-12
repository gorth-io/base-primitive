"use client"

import { BlinkingParticles } from "./blink"

export type IllustrationBackground =
  "ripple" | "gradient" | "particles" | "grid" | "none"

export type BackgroundProps = {
  background?: IllustrationBackground | IllustrationBackground[]
}

export const IllustrationsBackground = ({
  background = "none",
}: BackgroundProps) => {
  const backgrounds = Array.isArray(background) ? background : [background]

  return backgrounds.some((value) => value !== "none") ? (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 size-full max-h-88 max-w-88 -translate-x-1/2 -translate-y-1/2"
    >
      {backgrounds.includes("ripple") && (
        <>
          <div className="absolute top-1/2 left-1/2 -z-1 size-18 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-border opacity-70 [animation-duration:2s] motion-reduce:animate-none" />
          <div className="absolute top-1/2 left-1/2 -z-1 size-15 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-border [animation-delay:0.3s] [animation-duration:2s] motion-reduce:animate-none" />
        </>
      )}

      {backgrounds.includes("gradient") && (
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--muted-foreground),transparent_50%)] opacity-20" />
      )}

      {backgrounds.includes("grid") && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-muted)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-muted)_1px,transparent_1px)] mask-[radial-gradient(ellipse_35%_35%_at_50%_50%,#000_60%,transparent_100%)] bg-size-[36px_36px]" />
      )}

      {backgrounds.includes("particles") && (
        <div className="absolute -inset-6 rounded-full max-sm:-inset-4">
          <BlinkingParticles
            quantity={30}
            color="#808080"
            size={1}
            ease={45}
            staticity={40}
            edgeBias={0.8}
          />
        </div>
      )}
    </div>
  ) : null
}
