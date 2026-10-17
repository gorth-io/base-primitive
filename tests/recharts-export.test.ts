import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import * as Recharts from "recharts";
import * as Charts from "@gorth/primitive/cores/recharts";

it("re-exports chart primitives from the package-owned Recharts instance", () => {
  for (const name of [
    "Area",
    "Bar",
    "BarChart",
    "CartesianGrid",
    "ComposedChart",
    "Label",
    "Line",
    "LineChart",
    "Pie",
    "PieChart",
    "XAxis",
    "YAxis",
  ] as const) {
    expect(Charts[name]).toBe(Recharts[name]);
  }
});

it("publishes a client entry and forwards all Recharts types", () => {
  const source = readFileSync(
    new URL("../dist/cores/recharts.js", import.meta.url),
    "utf8",
  );
  const declarations = readFileSync(
    new URL("../dist/cores/recharts.d.ts", import.meta.url),
    "utf8",
  );
  expect(source).toMatch(/^\s*["']use client["']/);
  expect(declarations).toMatch(/export\s+\*\s+from\s+["']recharts["']/);
});
