import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

it("uses snake_case cookies on both client and server without changing CSS attributes", () => {
  const read = (file: string) => readFileSync(new URL("../src/" + file, import.meta.url), "utf8");
  const theme = read("providers/theme.tsx");
  const customizer = read("hooks/use-customizer.tsx");
  const layout = read("layouts/application.tsx");
  expect(theme).toContain('const THEME_COOKIE_NAME = "color_theme"');
  for (const key of ["ground", "paint", "chart"]) {
    expect(customizer).toContain('"color_' + key + '"');
    expect(layout).toContain('cookieStore.get("color_' + key + '")');
    expect(layout).toContain('"color-' + key + '"');
  }
  expect(customizer).toContain('root.setAttribute(`color-${key}`, value)');
  expect(layout).toContain('cookieStore.get("color_theme")');
  expect(layout).not.toMatch(/cookieStore\.get\("color-/);
});
