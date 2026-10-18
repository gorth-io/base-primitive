import { readFileSync } from "node:fs"
import ts from "typescript"
import { describe, expect, it } from "vitest"
import { SheetTitle, SheetDescription } from "@/components/custom/sheet"
import { SheetTitle as DefaultTitle, SheetDescription as DefaultDescription } from "@/components/ui/sheet"
import { GROUND_COLOR_OPTIONS, THEME_COLOR_OPTIONS, CHART_COLOR_OPTIONS } from "@/hooks/use-customizer"
import { layoutWidths, sidebarCollapsibles, sidebarVariants, navbarBehaviors } from "@/providers/layout"

const read = (file: string) => readFileSync(new URL("../src/" + file, import.meta.url), "utf8")

describe("customizer layout", () => {
  it("uses narrow/wide with the existing provider and cookie validation", () => {
    expect(layoutWidths).toEqual(["narrow", "wide"])
    const server = read("layouts/application.tsx")
    const client = read("providers/layout.tsx")
    expect(server).toContain('cookieStore.get("layout_width")?.value')
    expect(server).toContain('initialWidth === "wide" ? "wide" : "contained"')
    expect(client).not.toContain("normalizeLayoutWidth")
    expect(server).not.toContain("@/utils/layout")
    expect(client).not.toContain("@/utils/layout")
    const customizer = read("components/element/customizer.tsx")
    expect(customizer).toContain("value: 'narrow'")
    expect(customizer).toContain("value: 'wide'")
    expect(customizer).not.toMatch(/value: '(centered|full-width)'/)
  })

  it("has no multiword values in built-in customizer cookie options", () => {
    const values = [
      ...layoutWidths, ...sidebarCollapsibles, ...sidebarVariants, ...navbarBehaviors,
      "ltr", "rtl", "light", "dark", "system", "true", "false",
      ...[GROUND_COLOR_OPTIONS, THEME_COLOR_OPTIONS, CHART_COLOR_OPTIONS].flatMap((options) => options.map((option) => option.key)),
    ]
    for (const value of values) expect(value).not.toMatch(/[-\s]/)
  })

  it("reuses default Sheet title and description without overriding their styles", () => {
    expect(SheetTitle).toBe(DefaultTitle)
    expect(SheetDescription).toBe(DefaultDescription)
    const source = read("components/element/customizer.tsx")
    expect(source).toContain("<SheetTitle>Customizer</SheetTitle>")
    expect(source).toContain("<SheetDescription>")
  })

  it("places the body Separator between the padded groups without negative margins", () => {
    const source = read("components/element/customizer.tsx")
    const file = ts.createSourceFile("customizer.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    let count = 0
    const visit = (node: ts.Node) => {
      if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(file) === "Separator") {
        count++
        expect(node.attributes.properties.length).toBe(0)
        const parent = node.parent
        expect(ts.isJsxElement(parent)).toBe(true)
        if (ts.isJsxElement(parent)) {
          const attributes = parent.openingElement.attributes.getText(file)
          expect(attributes).toContain("overflow-y-auto")
          expect(attributes).not.toMatch(/\bp-4\b/)
          expect(parent.children.filter(ts.isJsxElement).map((child) => child.openingElement.attributes.getText(file))).toEqual([
            "className='flex flex-col gap-2 p-4'",
            "className='p-4'",
          ])
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(file)
    expect(count).toBe(1)
  })
})
