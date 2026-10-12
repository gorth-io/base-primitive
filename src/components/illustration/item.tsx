import * as React from "react";
import { UserRound } from "lucide-react";
import type { NavSubItem } from "@/utils/interface";

import { IllustrationsBackground, type BackgroundProps } from "./ground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Orbiting } from "./orbiting";

import { cn } from "cn";

export type AvatarItem = NavSubItem;

export function OrbitAvatar({
  item,
  size = 54,
  iconSize = 54,
}: {
  item: NavSubItem;
  size?: number;
  iconSize?: number;
}) {
  const Icon = item.icon ?? UserRound;
  const backgroundColor =
    item.description === "#" ? "transparent" : item.description;
  const iconColor =
    item.description && item.description !== "#" ? "#ffffff" : "currentColor";
  return (
    <Avatar
      aria-label={item.title}
      title={item.title}
      style={{ height: size, width: size, backgroundColor }}
      className="size-[54px] rounded-full after:rounded-full"
    >
      <AvatarImage
        className="rounded-full"
        src={item.url || undefined}
        alt={item.title}
      />
      <AvatarFallback
        className="rounded-full"
        style={{
          backgroundColor,
          color: iconColor,
        }}
      >
        <Icon
          aria-hidden="true"
          className={
            iconSize === 54
              ? "size-[54px]"
              : iconSize === 36
                ? "size-9"
                : "size-4"
          }
          style={{ width: iconSize, height: iconSize }}
        />
      </AvatarFallback>
    </Avatar>
  );
}

export interface RingConfig {
  ringSize?: number;
  avatarSize?: number;
  avatars?: AvatarItem[];
  duration?: number;
  reverse?: boolean;
  dashed?: boolean;
}

export interface AvatarOrbitProps extends React.HTMLAttributes<HTMLDivElement> {
  orbitData?: RingConfig[];
  background?: BackgroundProps["background"];
  isometric?: boolean;
  trigger?: "default" | "orbit" | "hover";
  children?: React.ReactElement;
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
  } = props;

  const activeRings = avatarConfig?.filter(
    (ring) => (ring.avatars?.length ?? 0) > 0,
  );

  const outerRing = activeRings?.reduce<RingConfig | undefined>(
    (max, ring) =>
      (ring.ringSize ?? 100) > (max ? (max.ringSize ?? 100) : 0) ? ring : max,
    undefined,
  );

  const containerSize = Math.max(
    124,
    (outerRing?.ringSize ?? 0) + (outerRing?.avatarSize ?? 36),
  );

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
        className,
      )}
      {...rest}
    >
      <IllustrationsBackground
        background={background}
        ringSize={outerRing ? (outerRing.ringSize ?? 100) : 0}
      />
      {activeRings?.map((ring, index) => (
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
              iconSize={16}
            />
          ))}
        </Orbiting>
      ))}
      {children}
    </div>
  );
};
