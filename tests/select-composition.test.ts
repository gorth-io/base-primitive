import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../src/", import.meta.url));

function componentFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory())
      return entry.name === "ui" ? [] : componentFiles(filename);
    return filename.endsWith(".tsx") ? [filename] : [];
  });
}

describe("custom Select consumers", () => {
  it("never imports the default Select inside maintained composed components", () => {
    for (const filename of componentFiles(path.join(root, "components"))) {
      const source = readFileSync(filename, "utf8");
      expect(source, filename).not.toMatch(/from\s+["'][^"']*\/ui\/select["']/);
    }
  });

  it("groups every option list and does not introduce labels into unlabeled consumers", () => {
    let popups = 0;
    for (const relative of [
      "components/custom/data-table.tsx",
      "components/io/color-picker.tsx",
    ]) {
      const filename = path.join(root, relative);
      const source = readFileSync(filename, "utf8");
      const file = ts.createSourceFile(
        filename,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      expect(source).toContain('from "@/components/custom/select"');
      function visit(node: ts.Node) {
        if (ts.isJsxElement(node)) {
          const name = node.openingElement.tagName.getText(file);
          expect(name, relative).not.toBe("SelectLabel");
          if (name === "SelectContent") {
            popups++;
            const children = node.children.filter(
              (child) => !ts.isJsxText(child) || child.text.trim(),
            );
            expect(children, relative).toHaveLength(1);
            expect(ts.isJsxElement(children[0]), relative).toBe(true);
            if (ts.isJsxElement(children[0]))
              expect(children[0].openingElement.tagName.getText(file)).toBe(
                "SelectGroup",
              );
          }
          if (name === "Select")
            expect(
              node.openingElement.attributes.properties.some(
                (attribute) =>
                  ts.isJsxAttribute(attribute) &&
                  attribute.name.text === "items",
              ),
              relative,
            ).toBe(true);
        }
        ts.forEachChild(node, visit);
      }
      visit(file);
    }
    expect(popups).toBe(3);
  });

  it("exports custom Select without redirecting the default module", () => {
    expect(
      readFileSync(path.join(root, "modules/custom.ts"), "utf8"),
    ).toContain('export * from "@/components/custom/select"');
    expect(
      readFileSync(path.join(root, "modules/default.ts"), "utf8"),
    ).toContain('export * from "@/components/ui/select"');
  });
});
