"use client";

import { useState } from "react";
import Image from "next/image";
import type { NavSubItem } from "@/utils/interface";
import { OrbitAvatar } from "./item";

export function OrbitBrand({ item }: { item: NavSubItem }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!item.url || failedSrc === item.url) {
    return (
      <div className="size-14 rounded-full">
        <OrbitAvatar item={{ ...item, url: "" }} size={56} iconSize={36} />
      </div>
    );
  }

  return (
    <div
      className="relative flex size-[54px] items-center justify-center overflow-hidden rounded-full"
      title={item.title}
      style={{
        width: 54,
        height: 54,
        backgroundColor:
          item.description === "#" ? "transparent" : item.description,
      }}
    >
      <Image
        src={item.url}
        alt={item.title}
        width={54}
        height={54}
        unoptimized
        className="size-[54px] rounded-full object-contain"
        onError={() => setFailedSrc(item.url)}
      />
    </div>
  );
}
