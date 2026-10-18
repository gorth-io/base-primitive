"use client"

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type SetStateAction,
} from "react"
import type { ThemeProviderProps, UseThemeProps } from "next-themes"
import { setCookie, removeCookie } from '@/lib/cookies'
import { useCookie } from "@/hooks/use-cookie"

const THEME_COOKIE_NAME = "color_theme"
const DEFAULT_THEMES = ["light", "dark"]

const ThemeContext = createContext<UseThemeProps | null>(null)
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

function getSystemTheme() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function getAllowedTheme(
  value: string | undefined,
  themes: readonly string[],
  enableSystem: boolean,
  fallback: string
) {
  if (enableSystem && value === "system") return value
  return themes.includes(value ?? "") ? value! : fallback
}

function withoutTransitions() {
  const style = document.createElement("style")

  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    window.setTimeout(() => style.remove(), 1)
  }
}

export function ThemeProvider({
  children,
  themes = DEFAULT_THEMES,
  forcedTheme,
  enableSystem = true,
  enableColorScheme = true,
  disableTransitionOnChange = false,
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "class",
  value,
}: ThemeProviderProps) {
  const availableThemes = useMemo(
    () => Array.from(new Set(themes)),
    [themes]
  )
  const fallbackTheme = getAllowedTheme(
    defaultTheme,
    availableThemes,
    enableSystem,
    enableSystem ? "system" : (availableThemes[0] ?? "light")
  )
  const themeCookie = useCookie(THEME_COOKIE_NAME, fallbackTheme)
  const theme = getAllowedTheme(
    themeCookie.value,
    availableThemes,
    enableSystem,
    fallbackTheme
  )
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")
  const activeTheme = getAllowedTheme(
    forcedTheme ?? theme,
    availableThemes,
    enableSystem,
    fallbackTheme
  )
  const resolvedTheme = activeTheme === "system" ? systemTheme : activeTheme

  const applyTheme = useCallback(
    (nextTheme: string) => {
      const root = document.documentElement
      const attributes = Array.isArray(attribute) ? attribute : [attribute]
      const attributeValue = value?.[nextTheme] ?? nextTheme
      const restoreTransitions = disableTransitionOnChange
        ? withoutTransitions()
        : undefined

      for (const name of attributes) {
        if (name === "class") {
          root.classList.remove(
            ...availableThemes.map((item) => value?.[item] ?? item)
          )
          root.classList.add(attributeValue)
        } else {
          root.setAttribute(name, attributeValue)
        }
      }

      if (enableColorScheme) root.style.colorScheme = nextTheme
      restoreTransitions?.()
    },
    [
      attribute,
      availableThemes,
      disableTransitionOnChange,
      enableColorScheme,
      value,
    ]
  )

  useIsomorphicLayoutEffect(() => {
    const nextResolvedTheme =
      activeTheme === "system" ? getSystemTheme() : activeTheme

    applyTheme(nextResolvedTheme)

    if (
      activeTheme === "system" &&
      nextResolvedTheme !== systemTheme
    ) {
      setSystemTheme(nextResolvedTheme as "light" | "dark")
    }
  }, [activeTheme, applyTheme, systemTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) =>
      setSystemTheme(event.matches ? "dark" : "light")

    setSystemTheme(mediaQuery.matches ? "dark" : "light")
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const setTheme = (nextTheme: SetStateAction<string>) => {
    const requestedTheme =
      typeof nextTheme === "function" ? nextTheme(theme) : nextTheme
    const validTheme = getAllowedTheme(
      requestedTheme,
      availableThemes,
      enableSystem,
      fallbackTheme
    )

    const nextResolvedTheme =
      validTheme === "system" ? getSystemTheme() : validTheme

    applyTheme(nextResolvedTheme)
    themeCookie.setValue(validTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        themes: enableSystem
          ? [...availableThemes, "system"]
          : availableThemes,
        forcedTheme,
        setTheme,
        theme: activeTheme,
        resolvedTheme,
        systemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}


// export type Theme = 'dark' | 'light' | 'system'
// type ResolvedTheme = Exclude<Theme, 'system'>

// const DEFAULT_THEME = 'system'
// const THEME_COOKIE_NAME = 'vite-ui-theme'
// const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

// type ThemeProviderProps = {
//   children: React.ReactNode
//   defaultTheme?: Theme
//   initialTheme?: Theme
//   storageKey?: string
// }

// type ThemeProviderState = {
//   defaultTheme: Theme
//   resolvedTheme: ResolvedTheme
//   theme: Theme
//   setTheme: (theme: Theme) => void
//   resetTheme: () => void
// }

// const initialState: ThemeProviderState = {
//   defaultTheme: DEFAULT_THEME,
//   resolvedTheme: 'light',
//   theme: DEFAULT_THEME,
//   setTheme: () => null,
//   resetTheme: () => null,
// }

// const ThemeContext = createContext<ThemeProviderState>(initialState)

// export function ThemeProvider({
//   children,
//   defaultTheme = DEFAULT_THEME,
//   initialTheme = defaultTheme,
//   storageKey = THEME_COOKIE_NAME,
//   ...props
// }: ThemeProviderProps) {
//   const [theme, _setTheme] = useState<Theme>(initialTheme)

//   // Optimized: Memoize the resolved theme calculation to prevent unnecessary re-computations
//   const resolvedTheme = useMemo((): ResolvedTheme => {
//     if (theme === 'system') {
//       if (typeof window === 'undefined') {
//         return 'light'
//       }
//       return window.matchMedia('(prefers-color-scheme: dark)').matches
//         ? 'dark'
//         : 'light'
//     }
//     return theme as ResolvedTheme
//   }, [theme])

//   useEffect(() => {
//     const root = window.document.documentElement
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

//     const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
//       root.classList.remove('light', 'dark') // Remove existing theme classes
//       root.classList.add(currentResolvedTheme) // Add the new theme class
//     }

//     const handleChange = () => {
//       if (theme === 'system') {
//         const systemTheme = mediaQuery.matches ? 'dark' : 'light'
//         applyTheme(systemTheme)
//       }
//     }

//     applyTheme(resolvedTheme)

//     mediaQuery.addEventListener('change', handleChange)

//     return () => mediaQuery.removeEventListener('change', handleChange)
//   }, [theme, resolvedTheme])

//   const setTheme = (theme: Theme) => {
//     setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE)
//     _setTheme(theme)
//   }

//   const resetTheme = () => {
//     removeCookie(storageKey)
//     _setTheme(DEFAULT_THEME)
//   }

//   const contextValue = {
//     defaultTheme,
//     resolvedTheme,
//     resetTheme,
//     theme,
//     setTheme,
//   }

//   return (
//     <ThemeContext.Provider value={contextValue} {...props}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext)

//   if (!context) throw new Error('useTheme must be used within a ThemeProvider')

//   return context
// }
