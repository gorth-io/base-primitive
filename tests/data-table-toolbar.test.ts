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
const actions = {
  onToggle: vi.fn(),
  onImport: vi.fn(),
  onDownload: vi.fn(),
  onReload: vi.fn(),
  onCreate: vi.fn(),
};

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
      const importIndex = header.indexOf('aria-label="Import"');
      const exportIndex = header.indexOf('aria-label="Export"');
      const addIndex = header.indexOf('aria-label="Add User"');
      expect(importIndex).toBeGreaterThan(header.indexOf('aria-label="Toggle"'));
      expect(exportIndex).toBeGreaterThan(importIndex);
      const reloadIndex = header.indexOf('aria-label="Reload"');
      expect(reloadIndex).toBeGreaterThan(exportIndex);
      expect(addIndex).toBeGreaterThan(reloadIndex);
      expect(header).toContain("h-9 gap-1.5 px-2.5");
      expect(html).toContain("lucide-plus");
      expect(html.indexOf('aria-label="Display mode"')).toBeGreaterThan(
        html.indexOf('aria-label="Rows per page"'),
      );
      expect(html).not.toContain("Workspace");
      expect(html).not.toMatch(/<button\b[^>]*\stitle=/);
    },
  );

  it("supports omitted nav and controlled view callbacks", () => {
    const html = renderToStaticMarkup(
      createElement(DataTableAll, { columns, data: rows }),
    );
    expect(html).not.toContain('data-slot="card-title"');
    expect(html).not.toContain('aria-label="Display mode"');
    const changed = vi.fn();
    const toggle = DataTableViewToggle({
      value: "list",
      onValueChange: changed,
    });
    toggle.props.onValueChange("grid");
    expect(changed).toHaveBeenCalledWith("grid");
  });

  it.each(["manual", "all"])(
    "keeps search, filters, page size and labeled actions in one header without nav (%s)",
    (mode) => {
      const shared = { columns, data: rows, ...actions };
      const html = renderToStaticMarkup(
        mode === "manual"
          ? createElement(DataTable, {
              ...shared,
              rowCount: 1,
              pagination: { pageIndex: 0, pageSize: 10 },
              onPaginationChange: vi.fn(),
              search: {
                placeholder: "Find user",
                value: "",
                onValueChange: vi.fn(),
              },
              filters: [
                {
                  id: "name",
                  title: "Name filter",
                  options: [],
                  value: [],
                  onValueChange: vi.fn(),
                },
              ],
            })
          : createElement(DataTableAll, {
              ...shared,
              search: { column: "name", placeholder: "Find user" },
              filters: [{ column: "name", title: "Name filter", options: [] }],
            }),
      );
      const header = html.slice(0, html.indexOf('<div class="border-y">'));
      expect(header).not.toContain('data-slot="card-title"');
      expect(header).not.toContain('aria-label="Display mode"');
      const positions = [
        'placeholder="Find user"',
        "Name filter",
        'aria-label="Rows per page"',
        'aria-label="Toggle"',
        'aria-label="Import"',
        'aria-label="Export"',
        'aria-label="Reload"',
        'aria-label="Add"',
      ].map((text) => header.indexOf(text));
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
      expect(header).toContain("h-9 gap-1.5 px-2.5");
      expect(header).not.toContain('class="sr-only">Import');
    },
  );

  it.each([undefined, nav])(
    "hides every action without its callback (nav=%s)",
    (nav) => {
      const html = renderToStaticMarkup(
        createElement(DataTableAll, { columns, data: rows, nav }),
      );
      for (const label of ["Toggle", "Import", "Export", "Reload", "Add"]) {
        expect(html).not.toContain(`aria-label="${label}"`);
      }
    },
  );

  it.each(Object.keys(actions) as (keyof typeof actions)[])(
    "only shows the action with a supplied %s callback",
    (callback) => {
      const html = renderToStaticMarkup(
        createElement(DataTableAll, {
          columns,
          data: rows,
          [callback]: actions[callback],
        }),
      );
      const labels = {
        onToggle: "Toggle",
        onImport: "Import",
        onDownload: "Export",
        onReload: "Reload",
        onCreate: "Add",
      };
      for (const [key, label] of Object.entries(labels)) {
        if (key === callback) expect(html).toContain(`aria-label="${label}"`);
        else expect(html).not.toContain(`aria-label="${label}"`);
      }
    },
  );

  it.each(["manual", "all"])(
    "uses icon sizing and accessible action labels for feat=icon (%s)",
    (mode) => {
      const shared = {
        columns,
        data: rows,
        nav,
        ...actions,
        feat: "icon" as const,
      };
      const html = renderToStaticMarkup(
        mode === "manual"
          ? createElement(DataTable, {
              ...shared,
              rowCount: 1,
              pagination: { pageIndex: 0, pageSize: 10 },
              onPaginationChange: vi.fn(),
            })
          : createElement(DataTableAll, shared),
      );
      const header = html.slice(0, html.indexOf('aria-label="Rows per page"'));
      expect(header).toContain("size-9");
      expect(header).not.toContain("h-9 gap-1.5 px-2.5");
      for (const label of ["Toggle", "Import", "Export", "Reload", "Add"]) {
        expect(header).toContain(`aria-label="${label}"`);
        expect(header).not.toContain(`title="${label}"`);
        expect(header).toContain(`class="sr-only">${label}</span>`);
      }
    },
  );

  it("gives both view tabs square size-9 triggers", () => {
    const html = renderToStaticMarkup(createElement(DataTableViewToggle));
    const tabs = html.match(/<button[^>]*>/g) ?? [];
    expect(tabs).toHaveLength(2);
    for (const tab of tabs) {
      expect(tab).toContain("size-9");
      expect(tab).not.toContain("px-3");
      expect(tab).not.toContain("title=");
    }
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
