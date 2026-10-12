import * as React from "react"

import {
  IllustrationsBackground,
  type BackgroundProps,
} from "./ground"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/custom/avatar"
import { Orbiting } from "./orbiting"
import { NavSubItem } from "@/utils/interface"

import { cn } from "cn"
import { UserRound } from "lucide-react"

export type AvatarItem = NavSubItem

export function OrbitAvatar({
  item,
  size = 36,
}: {
  item: NavSubItem
  size?: number
}) {
  const Icon = item.icon ?? UserRound
  return (
    <Avatar
      aria-label={item.title}
      title={item.title}
      style={{ height: size, width: size, backgroundColor: item.description }}
      className="rounded-md after:rounded-md"
    >
      <AvatarImage src={item.url || undefined} alt={item.title} />
      <AvatarFallback
        style={{
          backgroundColor: item.description,
          color: item.description ? "#ffffff" : undefined,
        }}
      >
        <Icon
          aria-hidden="true"
          style={{ width: size / 2, height: size / 2 }}
        />
      </AvatarFallback>
    </Avatar>
  )
}

export interface RingConfig {
  ringSize?: number
  avatarSize?: number
  avatars?: AvatarItem[]
  duration?: number
  reverse?: boolean
  dashed?: boolean
}

export interface AvatarOrbitProps extends React.HTMLAttributes<HTMLDivElement> {
  orbitData?: RingConfig[]
  background?: BackgroundProps["background"]
  isometric?: boolean
  trigger?: "default" | "orbit" | "hover"
  children?: React.ReactElement
}

export const AvatarOrbit = (props: AvatarOrbitProps) => {
  const {
    orbitData: avatarConfig,
    isometric = false,
    trigger = "default",
    background = "none",
    children,
    className,
    style,
    ...rest
  } = props

  const outerRing = avatarConfig?.reduce<RingConfig | undefined>(
    (max, ring) => ((ring.ringSize ?? 0) > (max?.ringSize ?? 0) ? ring : max),
    undefined
  )

  const containerSize = Math.max(
    124,
    (outerRing?.ringSize ?? 0) + (outerRing?.avatarSize ?? 36)
  )

  return (
    <div
      style={{
        height: containerSize,
        width: containerSize,
        ...(isometric && { transform: "rotateX(45deg) rotateZ(-45deg)" }),
        ...style,
      }}
      className={cn(
        "group relative isolate flex flex-col items-center justify-center",
        className
      )}
      {...rest}
    >
      <IllustrationsBackground background={background} />
      {avatarConfig?.map((ring, index) => (
        <Orbiting
          key={index}
          radius={(ring.ringSize ?? 100) / 2}
          duration={ring.duration}
          strokeWidth={1}
          dashed={ring.dashed}
          startingAngle={45}
          reverse={ring.reverse}
          className={cn({
            "[animation-play-state:paused]": trigger === "default",
            "[animation-play-state:paused] group-hover:[animation-play-state:running]":
              trigger === "hover",
          })}
        >
          {ring.avatars?.map((avatar, avatarIndex) => (
            <OrbitAvatar
              key={avatarIndex}
              item={avatar}
              size={ring.avatarSize ?? 36}
            />
          ))}
        </Orbiting>
      ))}
      {children}
    </div>
  )
}
