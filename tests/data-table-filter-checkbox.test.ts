import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { compile } from "tailwindcss";
import { Checkbox } from "@/components/ui/checkbox";
import { CommandItem } from "@/components/custom/command";
import {
  DataTableFacetedFilter,
  DataTableFacetedFilterAll,
} from "@/components/custom/data-table";
import type { DataTableFacetedFilterAllProps } from "@/utils/interface";

const options = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

function find(
  node: ReactNode,
  type: unknown,
): ReactElement<Record<string, any>>[] {
  const found: ReactElement<Record<string, any>>[] = [];
  Children.forEach(node, (child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return;
    if (child.type === type) found.push(child);
    found.push(...find(child.props.children, type));
  });
  return found;
}

it("uses default shadcn checkboxes as controlled indicators without a second click handler", () => {
  const tree = DataTableFacetedFilter({
    options,
    value: ["open"],
    onValueChange: vi.fn(),
  });
  const checkboxes = find(tree, Checkbox);
  expect(checkboxes.map((checkbox) => checkbox.props.checked)).toEqual([
    true,
    false,
  ]);
  for (const checkbox of checkboxes) {
    expect(checkbox.props.readOnly).toBe(true);
    expect(checkbox.props.tabIndex).toBe(-1);
    expect(checkbox.props["aria-hidden"]).toBe("true");
    expect(checkbox.props.className).toBe("pointer-events-none");
    expect(checkbox.props.onCheckedChange).toBeUndefined();
  }
});

it.each([
  [[], ["open"]],
  [["open"], []],
  [["open", "closed"], ["closed"]],
] as [string[], string[]][])(
  "keeps row selection behavior for %j",
  (value, expected) => {
    const changed = vi.fn();
    const tree = DataTableFacetedFilter({
      options,
      value,
      onValueChange: changed,
    });
    find(tree, CommandItem)[0].props.onSelect();
    expect(changed).toHaveBeenCalledExactlyOnceWith(expected);
  },
);

it("also uses shadcn Checkbox in the all-data filter and clears its last value", () => {
  const changed = vi.fn();
  const column = {
    getFilterValue: () => ["open"],
    getFacetedUniqueValues: () => new Map(),
    setFilterValue: changed,
  } as unknown as DataTableFacetedFilterAllProps<{ status: string }>["column"];
  const tree = DataTableFacetedFilterAll({ options, column });
  expect(
    find(tree, Checkbox).map((checkbox) => checkbox.props.checked),
  ).toEqual([true, false]);
  find(tree, CommandItem)[0].props.onSelect();
  expect(changed).toHaveBeenCalledExactlyOnceWith(undefined);
});

it("limits highlighted command icon colors to direct children, excluding checkbox ticks", async () => {
  const source = readFileSync(
    new URL("../src/components/custom/command.tsx", import.meta.url),
    "utf8",
  );
  const variant = "data-selected:[&>svg]:text-foreground";
  expect(source).toContain(variant);
  expect(source).not.toContain("data-selected:**:[svg]:text-foreground");
  const compiler = await compile(
    "@theme { --color-foreground: #fafafa; } @tailwind utilities;",
  );
  const css = compiler.build([variant]);
  expect(css).toContain("[data-selected] > svg");
});
