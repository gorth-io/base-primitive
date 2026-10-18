import { createElement, type ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, it, vi } from "vitest"

const saved = vi.hoisted(() => ({ width: undefined as string | undefined }))
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (key: string) => key === "layout_width" && saved.width !== undefined ? { value: saved.width } : undefined,
  }),
}))
vi.mock("@/providers/application", () => ({
  ApplicationProvider: ({ initialWidth, children }: { initialWidth: string; children: ReactNode }) =>
    createElement("main", { "data-initial-width": initialWidth }, children),
}))

import { ApplicationLayout } from "@/layouts/application"

it.each([
  ["narrow", "narrow", "contained"],
  ["wide", "wide", "wide"],
  ["centered", "narrow", "contained"],
  ["full-width", "narrow", "contained"],
  ["invalid", "narrow", "contained"],
  [undefined, "narrow", "contained"],
] as const)("renders cookie %s consistently into SSR and provider props", async (cookie, normalized, attribute) => {
  saved.width = cookie
  const html = renderToStaticMarkup(await ApplicationLayout({ children: "Content" }))
  expect(html).toContain('wide="' + attribute + '"')
  expect(html).toContain('data-initial-width="' + normalized + '"')
})
