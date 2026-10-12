"use client";

import { motion } from "motion/react";

import { BlinkingParticles } from "./blink";

export type IllustrationBackground =
  "ripple" | "gradient" | "particles" | "grid" | "none";

export type BackgroundProps = {
  background?: IllustrationBackground | IllustrationBackground[];
  ringSize?: number;
};

export const IllustrationsBackground = ({
  background = "none",
  ringSize,
}: BackgroundProps) => {
  const backgrounds = Array.isArray(background) ? background : [background];

  return backgrounds.some((value) => value !== "none") ? (
    <div
      aria-hidden="true"
      style={
        ringSize === undefined
          ? undefined
          : { width: ringSize, height: ringSize }
      }
      className="pointer-events-none absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2"
    >
      {backgrounds.includes("ripple") &&
        (ringSize === undefined || ringSize > 0) && (
          <svg
            className="absolute inset-0 -z-1 size-full overflow-visible"
            fill="none"
          >
            {[0, 0.5, 1].map((delay, index) => (
              <motion.circle
                key={index}
                cx="50%"
                cy="50%"
                r={0}
                stroke="var(--muted-foreground)"
                strokeWidth={1}
                initial={{ r: 0, opacity: 0 }}
                animate={{
                  r: [
                    0,
                    (ringSize ?? 144) / 15,
                    (ringSize ?? 144) / 2,
                    (ringSize ?? 144) / 2,
                  ],
                  opacity: [0, 1, 0, 0],
                }}
                transition={{
                  duration: 4.8,
                  times: [0, 0.05, 0.375, 1],
                  ease: "linear",
                  repeat: Infinity,
                  delay,
                }}
                className="motion-reduce:hidden"
              />
            ))}
          </svg>
        )}

      {backgrounds.includes("gradient") && (
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--muted-foreground),transparent_50%)] opacity-20" />
      )}

      {backgrounds.includes("grid") && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-muted)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-muted)_1px,transparent_1px)] mask-[radial-gradient(ellipse_35%_35%_at_50%_50%,#000_60%,transparent_100%)] bg-size-[36px_36px]" />
      )}

      {backgrounds.includes("particles") && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <BlinkingParticles
            key={ringSize}
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
  ) : null;
};
