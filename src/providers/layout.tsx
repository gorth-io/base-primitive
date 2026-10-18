"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, setCookie } from '@/lib/cookies'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type LayoutVariant = 'inset' | 'sidebar' | 'floating'
export type LayoutWidth = 'narrow' | 'wide'
export type NavbarBehavior = 'sticky' | 'scroll'

export const sidebarCollapsibles: Collapsible[] = [
  'offcanvas',
  'icon',
  'none',
]
export const sidebarVariants: LayoutVariant[] = [
  'sidebar',
  'floating',
  'inset',
]
export const layoutWidths: LayoutWidth[] = ['narrow', 'wide']
export const navbarBehaviors: NavbarBehavior[] = ['sticky', 'scroll']

// Cookie constants following the pattern from sidebar.tsx
const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant'
const LAYOUT_WIDTH_COOKIE_NAME = 'layout_width'
const NAVBAR_BEHAVIOR_COOKIE_NAME = 'navbar_behavior'
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Default values
const DEFAULT_VARIANT = 'sidebar'
const DEFAULT_COLLAPSIBLE = 'icon'
const DEFAULT_WIDTH = 'narrow'
const DEFAULT_NAVBAR_BEHAVIOR = 'sticky'

type LayoutContextType = {
  resetLayout: () => void

  defaultCollapsible: Collapsible
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void

  defaultVariant: LayoutVariant
  variant: LayoutVariant
  setVariant: (variant: LayoutVariant) => void

  defaultWidth: LayoutWidth
  width: LayoutWidth
  setWidth: (width: LayoutWidth) => void

  defaultNavbarBehavior: NavbarBehavior
  navbarBehavior: NavbarBehavior
  setNavbarBehavior: (behavior: NavbarBehavior) => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

function getSavedValue<T extends string>(
  name: string,
  values: readonly T[],
  fallback: T
) {
  const value = getCookie(name)

  return value && values.includes(value as T) ? (value as T) : fallback
}

type LayoutProviderProps = {
  children: React.ReactNode
  initialCollapsible?: Collapsible
  initialVariant?: LayoutVariant
  initialWidth?: LayoutWidth
  initialNavbarBehavior?: NavbarBehavior
}

export function LayoutProvider({
  children,
  initialCollapsible,
  initialVariant,
  initialWidth,
  initialNavbarBehavior,
}: LayoutProviderProps) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(
    initialCollapsible ?? DEFAULT_COLLAPSIBLE
  )

  const [variant, _setVariant] = useState<LayoutVariant>(
    initialVariant ?? DEFAULT_VARIANT
  )

  const [width, _setWidth] = useState<LayoutWidth>(
    initialWidth ?? DEFAULT_WIDTH
  )

  const [navbarBehavior, _setNavbarBehavior] = useState<NavbarBehavior>(
    initialNavbarBehavior ?? DEFAULT_NAVBAR_BEHAVIOR
  )

  useEffect(() => {
    if (!initialCollapsible) {
      _setCollapsible(
        getSavedValue(
          LAYOUT_COLLAPSIBLE_COOKIE_NAME,
          sidebarCollapsibles,
          DEFAULT_COLLAPSIBLE
        )
      )
    }

    if (!initialVariant) {
      _setVariant(
        getSavedValue(
          LAYOUT_VARIANT_COOKIE_NAME,
          sidebarVariants,
          DEFAULT_VARIANT
        )
      )
    }

    if (!initialWidth) {
      _setWidth(
        getSavedValue(
          LAYOUT_WIDTH_COOKIE_NAME,
          layoutWidths,
          DEFAULT_WIDTH
        )
      )
    }

    if (!initialNavbarBehavior) {
      _setNavbarBehavior(
        getSavedValue(
          NAVBAR_BEHAVIOR_COOKIE_NAME,
          navbarBehaviors,
          DEFAULT_NAVBAR_BEHAVIOR
        )
      )
    }
  }, [
    initialCollapsible,
    initialNavbarBehavior,
    initialVariant,
    initialWidth,
  ])

  useEffect(() => {
    if (
      !initialWidth &&
      width !==
        getSavedValue(
          LAYOUT_WIDTH_COOKIE_NAME,
          layoutWidths,
          DEFAULT_WIDTH
        )
    ) {
      return
    }

    document.documentElement.removeAttribute('layout-width')
    document.documentElement.setAttribute(
      'wide',
      width === 'wide' ? 'wide' : 'contained'
    )
  }, [initialWidth, width])

  const setCollapsible = (newCollapsible: Collapsible) => {
    const value = sidebarCollapsibles.includes(newCollapsible)
      ? newCollapsible
      : DEFAULT_COLLAPSIBLE

    _setCollapsible(value)
    setCookie(
      LAYOUT_COLLAPSIBLE_COOKIE_NAME,
      value,
      LAYOUT_COOKIE_MAX_AGE
    )
  }

  const setVariant = (newVariant: LayoutVariant) => {
    const value = sidebarVariants.includes(newVariant)
      ? newVariant
      : DEFAULT_VARIANT

    _setVariant(value)
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, value, LAYOUT_COOKIE_MAX_AGE)
  }

  const setWidth = (newWidth: LayoutWidth) => {
    const value = layoutWidths.includes(newWidth)
      ? newWidth
      : DEFAULT_WIDTH

    _setWidth(value)
    setCookie(LAYOUT_WIDTH_COOKIE_NAME, value, LAYOUT_COOKIE_MAX_AGE)
  }

  const setNavbarBehavior = (newBehavior: NavbarBehavior) => {
    const value = navbarBehaviors.includes(newBehavior)
      ? newBehavior
      : DEFAULT_NAVBAR_BEHAVIOR

    _setNavbarBehavior(value)
    setCookie(NAVBAR_BEHAVIOR_COOKIE_NAME, value, LAYOUT_COOKIE_MAX_AGE)
  }

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE)
    setVariant(DEFAULT_VARIANT)
    setWidth(DEFAULT_WIDTH)
    setNavbarBehavior(DEFAULT_NAVBAR_BEHAVIOR)
  }

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
    defaultWidth: DEFAULT_WIDTH,
    width,
    setWidth,
    defaultNavbarBehavior: DEFAULT_NAVBAR_BEHAVIOR,
    navbarBehavior,
    setNavbarBehavior,
  }

  return <LayoutContext value={contextValue}>{children}</LayoutContext>
}

// Define the hook for the provider
export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
