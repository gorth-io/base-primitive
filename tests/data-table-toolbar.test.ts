import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@bprogress/next", () => ({
  useProgress: () => ({ start: vi.fn(), stop: vi.fn() }),
}));
import {
  DataTable,
  DataTableAll,
  DataTableSearchInput,
  DataTableViewToggle,
} from "@/components/custom/data-table";

const rows = [{ id: "one", name: "Alice" }];
const columns = [{ accessorKey: "name", header: "Name" }];
const nav = {
  name: "Users",
  description: "Manage your organization members and their access.",
};
const actions = { onImport: vi.fn(), onDownload: vi.fn(), onCreate: vi.fn() };

describe("data-table toolbar", () => {
  it.each(["manual", "all"])(
    "renders the new %s table layout using default card typography and buttons",
    (mode) => {
      const shared = {
        columns,
        data: rows,
        nav,
        ...actions,
        labels: { add: "Add User" },
      };
      const html = renderToStaticMarkup(
        mode === "manual"
          ? createElement(DataTable, {
              ...shared,
              rowCount: 1,
              pagination: { pageIndex: 0, pageSize: 10 },
              onPaginationChange: vi.fn(),
              search: {
                placeholder: "Search users...",
                value: "",
                onValueChange: vi.fn(),
              },
            })
          : createElement(DataTableAll, {
              ...shared,
              search: { column: "name", placeholder: "Search users..." },
            }),
      );
      expect(html).toContain('data-slot="card-title"');
      expect(html).toContain('data-slot="card-description"');
      expect(html).toContain(nav.description);
      expect(html).toContain("lucide-search");
      expect(html).toContain("pl-8");
      expect(html).toContain("Alice");
      const header = html.slice(0, html.indexOf('aria-label="Rows per page"'));
      const importIndex = header.indexOf('title="Import"');
      const exportIndex = header.indexOf('title="Export"');
      const addIndex = header.indexOf('title="Add User"');
      expect(importIndex).toBeGreaterThan(
        header.indexOf('title="Toggle columns"'),
      );
      expect(exportIndex).toBeGreaterThan(importIndex);
      expect(addIndex).toBeGreaterThan(exportIndex);
      expect(header).toContain('data-size="default"');
      expect(html).toContain("lucide-plus");
      expect(html.indexOf('aria-label="Display mode"')).toBeGreaterThan(
        html.indexOf('aria-label="Rows per page"'),
      );
      expect(html).not.toContain("Workspace");
    },
  );

  it("supports omitted nav and controlled view callbacks", () => {
    const html = renderToStaticMarkup(
      createElement(DataTableAll, { columns, data: rows }),
    );
    expect(html).not.toContain('data-slot="card-title"');
    const changed = vi.fn();
    const toggle = DataTableViewToggle({
      value: "list",
      onValueChange: changed,
    });
    toggle.props.onValueChange("grid");
    expect(changed).toHaveBeenCalledWith("grid");
  });

  it("preserves search event handlers and aligns the icon independently of input text", () => {
    const changed = vi.fn();
    const search = DataTableSearchInput({ value: "Alice", onChange: changed });
    expect(search.props.children[0].props.onChange).toBe(changed);
    expect(search.props.children[0].props.className).toContain("pl-8");
    expect(search.props.children[1].props.className).toContain(
      "pointer-events-none",
    );
  });

  it("does not override card title/description or add button styling", () => {
    const source = readFileSync(
      new URL("../src/components/custom/data-table.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain("<CardTitle>{nav.name}</CardTitle>");
    expect(source).toContain(
      "<CardDescription>{nav.description}</CardDescription>",
    );
    expect(source).not.toMatch(/<Card(?:Title|Description)\s+className/);
    expect(source).toContain("onClick={onCreate}");
  });
});
