import * as React from "react"

import { cn } from "cn"

export interface OrbitingProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  dashed?: boolean
  dashedGap?: number
  path?: boolean
  speed?: number
  strokeColor?: string
  strokeWidth?: number
  startingAngle?: number
}

export function Orbiting({
  className,
  children,
  reverse,
  delay = 0,
  style,
  duration = 20,
  dashed = false,
  dashedGap = 4,
  radius = 160,
  path = true,
  speed = 1,
  strokeColor = "var(--border)",
  strokeWidth = 2,
  startingAngle = 0,
  ...props
}: OrbitingProps) {
  const calculatedDuration = duration / speed

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeDasharray={dashed ? `${dashedGap}` : ""}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle =
          (360 / React.Children.count(children)) * index + startingAngle

        return (
          <div
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                animationDelay: `${delay}s`,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              `absolute flex transform-gpu animate-orbit items-center justify-center rounded-full motion-reduce:[animation-play-state:paused]`,
              { "[animation-direction:reverse]": reverse },
              className
            )}
            {...props}
          >
            {child}
          </div>
        )
      })}
    </>
  )
}
