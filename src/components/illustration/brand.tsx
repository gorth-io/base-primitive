"use client";

import { useState } from "react";
import Image from "next/image";
import type { NavSubItem } from "@/utils/interface";
import { OrbitAvatar } from "./item";

export function OrbitBrand({ item }: { item: NavSubItem }) {
  const src = item.url.startsWith("/public/")
    ? item.url.slice("/public".length)
    : item.url;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return <OrbitAvatar item={{ ...item, url: "" }} />;
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
        src={src}
        alt={item.title}
        width={54}
        height={54}
        unoptimized
        className="size-[54px] rounded-full object-contain"
        onError={() => setFailedSrc(src)}
      />
    </div>
  );
}
