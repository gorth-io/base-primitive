"use client"

import { useCallback, useEffect, useMemo } from "react"

import { useCookie } from "@/hooks/use-cookie"
import { getCookie, removeCookie } from "@/lib/cookies"

export type ColorOption = {
  key: string
  label: string
  value: string
}

export type CustomizerState = {
  ground: string
  paint: string
  chart: string
}

export const GROUND_COLOR_OPTIONS: ColorOption[] = [
  { key: "neutral", label: "Neutral", value: "oklch(0.556 0 0)" },
  { key: "stone", label: "Stone", value: "oklch(0.553 0.013 58.071)" },
  { key: "zinc", label: "Zinc", value: "oklch(0.552 0.016 285.938)" },
  { key: "mauve", label: "Mauve", value: "oklch(0.542 0.034 322.5)" },
  { key: "olive", label: "Olive", value: "oklch(0.58 0.031 107.3)" },
  { key: "mist", label: "Mist", value: "oklch(0.56 0.021 213.5)" },
  { key: "taupe", label: "Taupe", value: "oklch(0.547 0.021 43.1)" },
]

export const THEME_COLOR_OPTIONS: ColorOption[] = [
  {
    key: "primary",
    label: "Primary",
    value: "var(--foreground)",
  },
  { key: "amber", label: "Amber", value: "#f59e0b" },
  { key: "blue", label: "Blue", value: "#3b82f6" },
  { key: "cyan", label: "Cyan", value: "#06b6d4" },
  { key: "emerald", label: "Emerald", value: "#10b981" },
  { key: "fuchsia", label: "Fuchsia", value: "#d946ef" },
  { key: "green", label: "Green", value: "#22c55e" },
  { key: "indigo", label: "Indigo", value: "#6366f1" },
  { key: "lime", label: "Lime", value: "#84cc16" },
  { key: "orange", label: "Orange", value: "#f97316" },
  { key: "pink", label: "Pink", value: "#ec4899" },
  { key: "purple", label: "Purple", value: "#a855f7" },
  { key: "red", label: "Red", value: "#ef4444" },
  { key: "rose", label: "Rose", value: "#f43f5e" },
  { key: "sky", label: "Sky", value: "#0ea5e9" },
  { key: "teal", label: "Teal", value: "#14b8a6" },
  { key: "violet", label: "Violet", value: "#8b5cf6" },
  { key: "yellow", label: "Yellow", value: "#eab308" },
  { key: "zero", label: "Zero", value: "#EC6683" },
  { key: "first", label: "First", value: "#696cff" },
  { key: "second", label: "Second", value: "#0d9394" },
  { key: "third", label: "Third", value: "#ffab1d" },
  { key: "fourth", label: "Fourth", value: "#eb3d63" },
  { key: "fifth", label: "Fifth", value: "#2092ec" },
]

export const CHART_COLOR_OPTIONS: ColorOption[] = [
  { key: "neutral", label: "Neutral", value: "var(--foreground)" },
  { key: "amber", label: "Amber", value: "oklch(0.769 0.188 70.08)" },
  { key: "blue", label: "Blue", value: "oklch(0.623 0.214 259.815)" },
  { key: "cyan", label: "Cyan", value: "oklch(0.715 0.143 215.221)" },
  { key: "emerald", label: "Emerald", value: "oklch(0.696 0.17 162.48)" },
  { key: "fuchsia", label: "Fuchsia", value: "oklch(0.667 0.295 322.15)" },
  { key: "green", label: "Green", value: "oklch(0.723 0.219 149.579)" },
  { key: "indigo", label: "Indigo", value: "oklch(0.585 0.233 277.117)" },
  { key: "lime", label: "Lime", value: "oklch(0.768 0.233 130.85)" },
  { key: "orange", label: "Orange", value: "oklch(0.705 0.213 47.604)" },
  { key: "pink", label: "Pink", value: "oklch(0.656 0.241 354.308)" },
  { key: "purple", label: "Purple", value: "oklch(0.627 0.265 303.9)" },
  { key: "red", label: "Red", value: "oklch(0.637 0.237 25.331)" },
  { key: "rose", label: "Rose", value: "oklch(0.645 0.246 16.439)" },
  { key: "sky", label: "Sky", value: "oklch(0.685 0.169 237.323)" },
  { key: "teal", label: "Teal", value: "oklch(0.704 0.14 182.503)" },
  { key: "violet", label: "Violet", value: "oklch(0.606 0.25 292.717)" },
  { key: "yellow", label: "Yellow", value: "oklch(0.795 0.184 86.047)" },
  { key: "zero", label: "Zero", value: "oklch(0.68296 0.16693 9.2103)" },
  { key: "first", label: "First", value: "oklch(0.61021 0.21346 277.129)" },
  { key: "second", label: "Second", value: "oklch(0.60186 0.10057 195.678)" },
  { key: "third", label: "Third", value: "oklch(0.80396 0.1659 72.547)" },
  { key: "fourth", label: "Fourth", value: "oklch(0.62935 0.20911 13.391)" },
  { key: "fifth", label: "Fifth", value: "oklch(0.64487 0.16476 248.642)" },
]

export const DEFAULT_CUSTOMIZER_STATE: CustomizerState = {
  ground: GROUND_COLOR_OPTIONS[0].key,
  paint: THEME_COLOR_OPTIONS[0].key,
  chart: CHART_COLOR_OPTIONS[0].key,
}

const STORAGE_KEYS: Record<keyof CustomizerState, string> = {
  ground: "color_ground",
  paint: "color_paint",
  chart: "color_chart",
}

const OPTION_GROUPS: Record<keyof CustomizerState, ColorOption[]> = {
  ground: GROUND_COLOR_OPTIONS,
  paint: THEME_COLOR_OPTIONS,
  chart: CHART_COLOR_OPTIONS,
}

function validateKey(
  key: keyof CustomizerState,
  value: string | null | undefined
) {
  return OPTION_GROUPS[key].some(
    (option) => option.key === value || option.value === value
  )
    ? OPTION_GROUPS[key].find(
        (option) => option.key === value || option.value === value
      )!.key
    : DEFAULT_CUSTOMIZER_STATE[key]
}

function applyCustomizerState(state: CustomizerState) {
  const root = document.documentElement

  Object.entries(state).forEach(([key, value]) => {
    // HTML attributes stay kebab-case to preserve the existing CSS selectors.
    root.setAttribute(`color-${key}`, value)
  })
}

export function useCustomizer() {
  const groundCookie = useCookie(
    STORAGE_KEYS.ground,
    DEFAULT_CUSTOMIZER_STATE.ground
  )
  const paintCookie = useCookie(
    STORAGE_KEYS.paint,
    DEFAULT_CUSTOMIZER_STATE.paint
  )
  const chartCookie = useCookie(
    STORAGE_KEYS.chart,
    DEFAULT_CUSTOMIZER_STATE.chart
  )
  const customizer = useMemo<CustomizerState>(
    () => ({
      ground: validateKey("ground", groundCookie.value),
      paint: validateKey("paint", paintCookie.value),
      chart: validateKey("chart", chartCookie.value),
    }),
    [groundCookie.value, chartCookie.value, paintCookie.value]
  )

  useEffect(() => {
    if (!groundCookie.ready || !paintCookie.ready || !chartCookie.ready) return

    const previousValue = getCookie("color_base")
    if (previousValue !== undefined) {
      if (getCookie(STORAGE_KEYS.ground) === undefined) {
        groundCookie.setValue(validateKey("ground", previousValue))
      }
      removeCookie("color_base")
    }
    applyCustomizerState(customizer)
  }, [
    groundCookie.ready,
    chartCookie.ready,
    customizer,
    paintCookie.ready,
    groundCookie.setValue,
  ])

  const setColor = useCallback(
    (key: keyof CustomizerState, value: string) => {
      const validatedValue = validateKey(key, value)

      if (key === "ground") groundCookie.setValue(validatedValue)
      if (key === "paint") paintCookie.setValue(validatedValue)
      if (key === "chart") chartCookie.setValue(validatedValue)
    },
    [groundCookie.setValue, chartCookie.setValue, paintCookie.setValue]
  )

  const resetCustomizer = useCallback(() => {
    groundCookie.resetValue()
    paintCookie.resetValue()
    chartCookie.resetValue()
    applyCustomizerState(DEFAULT_CUSTOMIZER_STATE)
  }, [groundCookie.resetValue, chartCookie.resetValue, paintCookie.resetValue])

  return { customizer, resetCustomizer, setColor }
}
