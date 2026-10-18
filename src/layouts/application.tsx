import type { PropsWithChildren } from "react"
import { cookies } from "next/headers"
import { cn } from "cn"

import { ApplicationProvider } from "@/providers/application"
import type { Direction } from "@/providers/direction"
import type {
  Collapsible,
  LayoutVariant,
  LayoutWidth,
  NavbarBehavior,
} from "@/providers/layout"

const layoutVariants = new Set<LayoutVariant>([
  "sidebar",
  "floating",
  "inset",
])
const layoutCollapsibles = new Set<Collapsible>([
  "offcanvas",
  "icon",
  "none",
])
const layoutWidths = new Set<LayoutWidth>(["centered", "full-width"])
const navbarBehaviors = new Set<NavbarBehavior>(["sticky", "scroll"])
const directions = new Set<Direction>(["ltr", "rtl"])
const themes = new Set(["light", "dark", "system"] as const)

function getCookieValue<T extends string>(
  value: string | undefined,
  allowed: ReadonlySet<T>,
  fallback: T
) {
  return allowed.has(value as T) ? (value as T) : fallback
}

function getThemeScript(theme: "light" | "dark" | "system") {
  return `(()=>{const d=document.documentElement;const t=${JSON.stringify(theme)};const r=t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":t==="system"?"light":t;d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r})()`
}

export async function ApplicationLayout({
  children,
  className,
  bodyClassName,
  lang = "en",
}: PropsWithChildren<{
  className?: string
  bodyClassName?: string
  lang?: string
}>) {
  const cookieStore = await cookies()
  const initialVariant = getCookieValue(
    cookieStore.get("layout_variant")?.value,
    layoutVariants,
    "sidebar"
  )
  const initialCollapsible = getCookieValue(
    cookieStore.get("layout_collapsible")?.value,
    layoutCollapsibles,
    "icon"
  )
  const initialWidth = getCookieValue(
    cookieStore.get("layout_width")?.value,
    layoutWidths,
    "centered"
  )
  const initialNavbarBehavior = getCookieValue(
    cookieStore.get("navbar_behavior")?.value,
    navbarBehaviors,
    "sticky"
  )
  const initialDirection = getCookieValue(
    cookieStore.get("dir")?.value,
    directions,
    "ltr"
  )
  const initialTheme = getCookieValue(
    cookieStore.get("color_theme")?.value,
    themes,
    "system"
  )
  const htmlCustomizerAttributes = {
    "color-ground":
      cookieStore.get("color_ground")?.value ??
      cookieStore.get("color_base")?.value ??
      "neutral",
    "color-paint": cookieStore.get("color_paint")?.value ?? "primary",
    "color-chart": cookieStore.get("color_chart")?.value ?? "neutral",
    wide: initialWidth === "full-width" ? "wide" : "contained",
  }

  return (
    <html
      lang={lang}
      dir={initialDirection}
      {...htmlCustomizerAttributes}
      suppressHydrationWarning
      className={cn(
        className,
        initialTheme === "system" ? undefined : initialTheme
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getThemeScript(initialTheme) }}
        />
      </head>
      <body className={bodyClassName}>
        <ApplicationProvider
          initialCollapsible={initialCollapsible}
          initialDirection={initialDirection}
          initialNavbarBehavior={initialNavbarBehavior}
          initialTheme={initialTheme}
          initialVariant={initialVariant}
          initialWidth={initialWidth}
        >
          {children}
        </ApplicationProvider>
      </body>
    </html>
  )
}
