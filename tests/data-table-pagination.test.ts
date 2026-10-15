import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { expect, it, vi } from "vitest";
import { Button } from "@/components/custom/button";
import {
  DataTablePagination,
  DataTablePaginationAll,
} from "@/components/custom/data-table";
import type { DataTablePaginationProps } from "@/utils/interface";

function buttons(
  node: ReactNode,
): ReactElement<{
  onClick?: () => void;
  "aria-current"?: string;
  children?: ReactNode;
}>[] {
  const result: ReturnType<typeof buttons> = [];
  Children.forEach(node, (child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return;
    if (child.type === Button) result.push(child);
    result.push(...buttons(child.props.children));
  });
  return result;
}

it.each([
  ["controlled", DataTablePagination],
  ["all-data", DataTablePaginationAll],
] as const)(
  "does not start progress when clicking the active %s page",
  (_name, Pagination) => {
    const start = vi.fn();
    const setPageIndex = vi.fn();
    const table = {
      state: { pagination: { pageIndex: 1, pageSize: 10 }, rowSelection: {} },
      getPageCount: () => 10,
      getRowCount: () => 100,
      getFilteredRowModel: () => ({ rows: Array(100) }),
      getFilteredSelectedRowModel: () => ({ rows: [] }),
      getCanPreviousPage: () => true,
      getCanNextPage: () => true,
      setPageIndex,
    } as unknown as DataTablePaginationProps<{ id: string }>["table"];
    const items = buttons(Pagination({ table, onPageChangeStart: start }));
    const active = items.find(
      (button) => button.props["aria-current"] === "page",
    );
    expect(active).toBeDefined();
    expect(active?.props.onClick).toBeUndefined();
    active?.props.onClick?.();
    expect(start).not.toHaveBeenCalled();
    expect(setPageIndex).not.toHaveBeenCalled();

    // Page 3 is immediately after the active page 2 in both layouts.
    const nextNumber = items[items.indexOf(active!) + 1];
    nextNumber.props.onClick?.();
    expect(start).toHaveBeenCalledExactlyOnceWith();
    expect(setPageIndex).toHaveBeenCalledExactlyOnceWith(2);
  },
);
