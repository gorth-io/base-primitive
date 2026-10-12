import * as React from "react";

import { cn } from "cn";

export interface OrbitingProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  dashed?: boolean;
  dashedGap?: number;
  path?: boolean;
  speed?: number;
  strokeColor?: string;
  strokeWidth?: number;
  startingAngle?: number;
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
  const calculatedDuration = duration / speed;

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
          (360 / React.Children.count(children)) * index + startingAngle;

        return (
          <div
            style={
              {
                position: "absolute",
                inset: 0,
                transformOrigin: "50% 50%",
                animationDuration: `${calculatedDuration}s`,
                "--radius": radius,
                "--angle": angle,
                animationDelay: `${delay}s`,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              `absolute inset-0 flex animate-spin items-center justify-center rounded-full motion-reduce:[animation-play-state:paused]`,
              { "[animation-direction:reverse]": reverse },
              className,
            )}
            {...props}
          >
            <div
              className="absolute top-1/2 left-1/2 flex size-0 items-center justify-center [animation-play-state:inherit]"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 0,
                height: 0,
                transform: `rotate(${angle}deg) translateY(${radius}px)`,
              }}
            >
              <div
                className="flex items-center justify-center [animation-play-state:inherit]"
                style={{ transform: `rotate(${-angle}deg)` }}
              >
                <div
                  className={cn(
                    "flex animate-spin items-center justify-center [animation-duration:inherit] [animation-play-state:inherit] motion-reduce:[animation-play-state:paused]",
                    { "[animation-direction:reverse]": !reverse },
                  )}
                  style={{
                    animationDuration: `${calculatedDuration}s`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  {child}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
