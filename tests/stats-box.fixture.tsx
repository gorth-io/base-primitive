import { DollarSign } from "lucide-react";
import type { NavSubItem } from "@/utils/interface";
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

const identity: Pick<NavSubItem, "title" | "description" | "icon"> = {
  title: "Revenue",
  description: "vs last month",
  icon: DollarSign,
};
const item: StatsBoxProps = {
  ...identity,
  number: "$1,250",
  isActive: 1,
  change: "+12%",
};
const flat: StatsBoxProps = {
  title: "Tasks",
  number: 0,
  isActive: 0,
  change: 0,
};
const down: StatsBoxProps = { title: "Revenue", number: 100, isActive: -1 };
const text: StatsBoxProps = { title: "Focus", number: "Deep Work" };
void [flat, down, text];

// @ts-expect-error The primary value is required.
const missing: StatsBoxProps = { title: "Revenue" };
const booleanDirection: StatsBoxProps = {
  title: "Revenue",
  number: 1,
  // @ts-expect-error Direction is not the boolean navigation active state.
  isActive: true,
};
const invalidDirection: StatsBoxProps = {
  title: "Revenue",
  number: 1,
  // @ts-expect-error Only -1, 0 and 1 are valid directions.
  isActive: 2,
};
void [missing, booleanDirection, invalidDirection];

export const examples = [
  StatsBox,
  StatsBoxDefault,
  StatsBoxCrm,
  StatsBoxFinance,
  StatsBoxAnalytics,
  StatsBoxProductivity,
  StatsBoxEcommerce,
  StatsBoxAcademy,
].map((Component, index) => <Component key={index} {...item} />);
