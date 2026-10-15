import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DollarSign } from "lucide-react";
import {
  StatsBox,
  StatsBoxDefault,
  StatsBoxCrm,
  StatsBoxFinance,
  StatsBoxAnalytics,
  StatsBoxProductivity,
  StatsBoxEcommerce,
  StatsBoxAcademy,
  type StatsBoxProps,
} from "@/components/element/stats-box";

const variants = [
  ["standard", StatsBox],
  ["default", StatsBoxDefault],
  ["crm", StatsBoxCrm],
  ["finance", StatsBoxFinance],
  ["analytics", StatsBoxAnalytics],
  ["productivity", StatsBoxProductivity],
  ["ecommerce", StatsBoxEcommerce],
  ["academy", StatsBoxAcademy],
] as const;

const item: StatsBoxProps = {
  title: "Revenue",
  description: "vs last month",
  icon: DollarSign,
  number: "$1,250.00",
  change: "+12.5%",
  isActive: 1,
};

describe.each(variants)("StatsBox %s", (name, Component) => {
  it("renders the supplied identity, formatted value and description", () => {
    const html = renderToStaticMarkup(createElement(Component, item));
    expect(html).toContain(`data-stats-box="${name}"`);
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Revenue"');
    expect(html).toContain("$1,250.00");
    expect(html).toContain("vs last month");
    expect(html).toContain("lucide-dollar-sign");
    expect(html).toContain("+12.5%");
    expect(html).not.toContain('href="#"');
  });

  it.each([
    [1, "Increase"],
    [-1, "Decrease"],
    [0, "Unchanged"],
  ] as const)(
    "supports direction %s independently of the display text",
    (direction, label) => {
      const html = renderToStaticMarkup(
        createElement(Component, {
          ...item,
          isActive: direction,
          change: 0,
          number: 0,
        }),
      );
      expect(html).toContain(`data-direction="${direction}"`);
      expect(html).toContain(label);
      expect(html).not.toContain("NaN");
      expect(html).toMatch(/data-slot="stats-number"[^>]*>0</);
      expect(html.replace(/<[^>]*>/g, "")).toContain(`${label}: 0`);
    },
  );

  it("does not fabricate a trend when change is unavailable", () => {
    const html = renderToStaticMarkup(
      createElement(Component, {
        title: "Focus",
        number: "Deep Work",
        description: "2 hours remaining",
      }),
    );
    expect(html).toContain("Deep Work");
    expect(html).not.toContain('data-slot="stats-change"');
    expect(html).not.toContain("undefined");
    expect(html).not.toContain("NaN");
  });

  it("shows an explicitly supplied direction without inventing a change amount", () => {
    const html = renderToStaticMarkup(
      createElement(Component, {
        title: "Revenue",
        number: 10,
        isActive: -1,
      }),
    );
    expect(html).toContain('data-direction="-1"');
    expect(html).toContain("Decrease");
    expect(html).toMatch(/lucide-(trending-down|arrow-down-right|arrow-down)/);
    expect(html).not.toContain("%");
  });

  it("allows joined layouts through root classes without changing internal styles", () => {
    const html = renderToStaticMarkup(
      createElement(Component, {
        ...item,
        className: "rounded-none ring-0 border-r",
      }),
    );
    const card = html.match(/<div[^>]*data-stats-box[^>]*>/)?.[0];
    expect(card).toContain("rounded-none");
    expect(card).toContain("ring-0");
    expect(card).toContain("border-r");
  });
});

it("uses neutral treatment for flat changes", () => {
  const html = renderToStaticMarkup(
    createElement(StatsBox, { ...item, isActive: 0, change: "0%" }),
  );
  expect(html).toContain("lucide-minus");
  expect(html).toContain("bg-muted text-muted-foreground");
  expect(html).not.toContain("lucide-trending-up");
});

it("keeps direction separate from inverse business impact for costs and returns", () => {
  const html = renderToStaticMarkup(
    createElement(StatsBoxEcommerce, {
      ...item,
      title: "Return requests",
      isActive: 1,
      inverse: true,
      change: "+0.6%",
    }),
  );
  expect(html).toContain('data-direction="1"');
  expect(html).toContain("Increase");
  expect(html).toContain("text-destructive");
  expect(html).toContain("+0.6%");
});

it("retains a zero previous value and highlights comparison context", () => {
  const html = renderToStaticMarkup(
    createElement(StatsBoxAnalytics, {
      ...item,
      previous: 0,
      description: "last 4 weeks",
    }),
  );
  expect(html).toContain('class="font-medium text-foreground">0</span>');
  expect(html).toContain("from ");
  expect(html).toContain(" · last 4 weeks");
});

it("preserves supplied links and app-owned actions instead of inventing behavior", () => {
  const linked = renderToStaticMarkup(
    createElement(StatsBoxCrm, { ...item, url: "/pipeline" }),
  );
  expect(linked).toContain('href="/pipeline"');
  expect(linked).toContain('aria-label="View Revenue"');
  const custom = renderToStaticMarkup(
    createElement(StatsBoxAcademy, {
      ...item,
      action: createElement("button", { type: "button" }, "Details"),
    }),
  );
  expect(custom).toContain(">Details</button>");
  expect(custom).not.toContain("lucide-info");
});

it("exposes exactly the eight requested stats components through the element module", () => {
  const source = readFileSync(
    new URL("../src/components/element/stats-box.tsx", import.meta.url),
    "utf8",
  );
  expect(source.match(/export function StatsBox\w*\(/g)).toHaveLength(8);
  const module = readFileSync(
    new URL("../src/modules/element.ts", import.meta.url),
    "utf8",
  );
  expect(module).toContain('export * from "@/components/element/stats-box"');
  const pkg = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );
  expect(pkg.exports["./element/*"].import).toBe(
    "./dist/components/element/*.js",
  );
});
