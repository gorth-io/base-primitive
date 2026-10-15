import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Ellipsis,
  Info,
  Minus,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/custom/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { StatsBoxProps } from "@/utils/interface";

export type { StatsBoxProps } from "@/utils/interface";

const valueClass = "text-3xl tabular-nums leading-none tracking-tight";
const positiveClass = "text-green-700 dark:text-green-300";
const positiveBadgeClass =
  "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300";
const negativeBadgeClass =
  "border-destructive/20 bg-destructive/10 text-destructive";
const neutralBadgeClass = "border-border bg-muted text-muted-foreground";

function hasValue(value: StatsBoxProps["change"]) {
  return value !== undefined && value !== "";
}

function trendTone({ isActive = 0, inverse = false }: StatsBoxProps) {
  return isActive * (inverse ? -1 : 1);
}

function Trend({
  data,
  appearance = "outline",
  arrows = "trend",
}: {
  data: StatsBoxProps;
  appearance?: "outline" | "default" | "soft" | "text";
  arrows?: "trend" | "diagonal" | "vertical" | "none";
}) {
  if (!hasValue(data.change) && data.isActive === undefined) return null;
  const direction = data.isActive ?? 0;
  const tone = trendTone(data);
  const icons =
    arrows === "diagonal"
      ? [ArrowDownRight, ArrowRight, ArrowUpRight]
      : arrows === "vertical"
        ? [ArrowDown, Minus, ArrowUp]
        : [TrendingDown, Minus, TrendingUp];
  const Icon = icons[direction + 1];
  const content = (
    <>
      <span className="sr-only">
        {direction === 1
          ? "Increase"
          : direction === -1
            ? "Decrease"
            : "Unchanged"}
        :{" "}
      </span>
      {(arrows !== "none" || !hasValue(data.change)) && (
        <Icon aria-hidden="true" className="size-3" />
      )}
      {data.change}
    </>
  );

  if (appearance === "text") {
    return (
      <span
        data-slot="stats-change"
        data-direction={direction}
        className={cn(
          "inline-flex items-center gap-1",
          tone > 0
            ? positiveClass
            : tone < 0
              ? "text-destructive"
              : "text-muted-foreground",
        )}
      >
        {content}
      </span>
    );
  }

  return (
    <Badge
      data-slot="stats-change"
      data-direction={direction}
      variant={
        appearance === "default"
          ? tone < 0
            ? "destructive"
            : tone > 0
              ? "default"
              : "secondary"
          : "outline"
      }
      className={cn(
        appearance !== "default" &&
          (tone > 0
            ? positiveBadgeClass
            : tone < 0
              ? negativeBadgeClass
              : neutralBadgeClass),
        appearance === "soft" && "border-transparent",
      )}
    >
      {content}
    </Badge>
  );
}

function IconBox({
  icon: Icon,
  small = false,
}: {
  icon?: LucideIcon;
  small?: boolean;
}) {
  if (!Icon) return null;
  return (
    <div
      data-slot="stats-icon"
      className={
        small
          ? "grid size-6 shrink-0 place-items-center rounded-sm bg-muted"
          : "grid size-7 shrink-0 place-items-center rounded-lg border bg-muted text-muted-foreground"
      }
    >
      <Icon aria-hidden="true" className={small ? "size-3" : "size-4"} />
    </div>
  );
}

function HeaderAction({
  data,
  icon: Icon,
  small = false,
}: {
  data: StatsBoxProps;
  icon: LucideIcon;
  small?: boolean;
}) {
  if (data.action !== undefined) return <>{data.action}</>;
  if (data.url) {
    return (
      <a
        href={data.url}
        aria-label={`View ${data.title}`}
        className="inline-flex rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Icon aria-hidden="true" className={small ? "size-3" : "size-4"} />
      </a>
    );
  }
  return (
    <Icon
      aria-hidden="true"
      className={small ? "size-3 text-muted-foreground" : "size-4"}
    />
  );
}

function Comparison({
  data,
  from = false,
}: {
  data: StatsBoxProps;
  from?: boolean;
}) {
  const previous = hasValue(data.previous);
  if (!previous && !data.description) return null;
  return (
    <p data-slot="stats-description" className="text-sm text-muted-foreground">
      {previous && (
        <>
          {from && "from "}
          <span className="font-medium text-foreground">{data.previous}</span>
          {data.description && (from ? " · " : " ")}
        </>
      )}
      {data.description}
    </p>
  );
}

function Box({
  data,
  variant,
  className,
  children,
}: {
  data: StatsBoxProps;
  variant: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card
      data-stats-box={variant}
      role="group"
      aria-label={data.title}
      className={cn("min-w-0", className, data.className)}
    >
      {children}
    </Card>
  );
}

/** Standardized eighth layout: title/icon, value/change, comparison context. */
export function StatsBox(data: StatsBoxProps) {
  return (
    <Box data={data} variant="standard">
      <CardHeader>
        <CardDescription>{data.title}</CardDescription>
        {(data.icon || data.action) && (
          <CardAction>{data.action ?? <IconBox icon={data.icon} />}</CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            data-slot="stats-number"
            className={cn(valueClass, "font-medium")}
          >
            {data.number}
          </div>
          <Trend data={data} />
        </div>
        <Comparison data={data} />
      </CardContent>
    </Box>
  );
}

/** Default dashboard: top-left icon, muted title and inline change badge. */
export function StatsBoxDefault(data: StatsBoxProps) {
  return (
    <Box
      data={data}
      variant="default"
      className="bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card"
    >
      <CardHeader>
        {data.icon && (
          <CardTitle>
            <IconBox icon={data.icon} />
          </CardTitle>
        )}
        <CardDescription>{data.title}</CardDescription>
        {data.action && <CardAction>{data.action}</CardAction>}
      </CardHeader>
      <CardContent className="gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <div
            data-slot="stats-number"
            className={cn(valueClass, "font-medium")}
          >
            {data.number}
          </div>
          <Trend data={data} appearance="default" />
        </div>
        <Comparison data={data} />
      </CardContent>
    </Box>
  );
}

/** CRM: top-right destination icon and previous-period comparison. */
export function StatsBoxCrm(data: StatsBoxProps) {
  return (
    <Box data={data} variant="crm">
      <CardHeader>
        <CardDescription>{data.title}</CardDescription>
        <CardAction>
          <HeaderAction data={data} icon={data.icon ?? ArrowUpRight} />
        </CardAction>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div data-slot="stats-number" className={valueClass}>
            {data.number}
          </div>
          <Trend data={data} />
        </div>
        <Comparison data={data} />
      </CardContent>
    </Box>
  );
}

/** Finance: heading above right-aligned amount, context and change. */
export function StatsBoxFinance(data: StatsBoxProps) {
  return (
    <Box data={data} variant="finance" className="gap-5">
      <CardHeader>
        <CardTitle className="font-normal">{data.title}</CardTitle>
        {(data.icon || data.action) && (
          <CardAction>{data.action ?? <IconBox icon={data.icon} />}</CardAction>
        )}
      </CardHeader>
      <CardContent className="items-end gap-3 text-right">
        <div className="space-y-1">
          <div
            data-slot="stats-number"
            className={cn(valueClass, "font-heading")}
          >
            {data.number}
          </div>
          <div className="[&>p]:text-xs">
            <Comparison data={data} />
          </div>
        </div>
        <Trend data={data} appearance="soft" arrows="none" />
      </CardContent>
    </Box>
  );
}

/** Analytics: compact value/change row, overflow action and previous value. */
export function StatsBoxAnalytics(data: StatsBoxProps) {
  return (
    <Box data={data} variant="analytics">
      <CardHeader>
        <CardTitle className="text-sm font-normal">{data.title}</CardTitle>
        <CardAction>
          <HeaderAction data={data} icon={data.icon ?? Ellipsis} />
        </CardAction>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            data-slot="stats-number"
            className="text-2xl tabular-nums leading-none tracking-tight"
          >
            {data.number}
          </div>
          <Trend data={data} appearance="soft" arrows="diagonal" />
        </div>
        <div className="[&>p]:text-xs">
          <Comparison data={data} from />
        </div>
      </CardContent>
    </Box>
  );
}

/** Productivity: icon and title together, free-form value and lower-right link. */
export function StatsBoxProductivity(data: StatsBoxProps) {
  return (
    <Box data={data} variant="productivity" className="shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconBox icon={data.icon} />
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div
            data-slot="stats-number"
            className="text-2xl tabular-nums leading-none tracking-tight"
          >
            {data.number}
          </div>
          <Trend data={data} appearance="soft" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Comparison data={data} />
          <HeaderAction data={data} icon={ArrowRight} />
        </div>
      </CardContent>
    </Box>
  );
}

/** E-commerce: amount below title, small icon at right, inline change context. */
export function StatsBoxEcommerce(data: StatsBoxProps) {
  return (
    <Box data={data} variant="ecommerce" className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-normal">{data.title}</CardTitle>
        <CardDescription
          data-slot="stats-number"
          className={cn(valueClass, "text-foreground")}
        >
          {data.number}
        </CardDescription>
        {(data.icon || data.action) && (
          <CardAction>
            {data.action ?? <IconBox icon={data.icon} small />}
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          <Trend data={data} appearance="text" arrows="none" />
          {data.description && (
            <span
              data-slot="stats-description"
              className="text-muted-foreground"
            >
              {(hasValue(data.change) || data.isActive !== undefined) && " "}
              {data.description}
            </span>
          )}
        </p>
      </CardContent>
    </Box>
  );
}

/** Academy: info action, inline change and right-aligned supporting detail. */
export function StatsBoxAcademy(data: StatsBoxProps) {
  return (
    <Box data={data} variant="academy">
      <CardHeader>
        <CardTitle className="text-sm">{data.title}</CardTitle>
        <CardAction>
          <HeaderAction data={data} icon={data.icon ?? Info} small />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <div
            data-slot="stats-number"
            className={cn(valueClass, "text-foreground")}
          >
            {data.number}
          </div>
          <Trend data={data} arrows="vertical" />
        </div>
        <div className="text-right [&>p]:text-xs">
          <Comparison data={data} />
        </div>
      </CardContent>
    </Box>
  );
}
