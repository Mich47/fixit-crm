import type { OrderStatus } from "@/generated/prisma/client";

export type DashboardStatusFilter = OrderStatus | "ALL";

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "IN_PROGRESS",
  "READY",
  "ARCHIVED",
] as const satisfies readonly OrderStatus[];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Очікує",
  IN_PROGRESS: "В роботі",
  READY: "Готово",
  ARCHIVED: "Архів",
};

export const ORDER_STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    badgeClasses: string;
    selectClasses: string;
    optionClasses: string;
  }
> = {
  PENDING: {
    label: "Очікує",
    badgeClasses: "border-amber-400/30 bg-amber-400/40 text-amber-200",
    selectClasses: "text-amber-400 border-amber-500/30 focus:ring-amber-500",
    optionClasses: "text-amber-400 bg-slate-900 font-semibold",
  },
  IN_PROGRESS: {
    label: "В роботі",
    badgeClasses: "border-sky-400/30 bg-sky-400/40 text-sky-200",
    selectClasses: "text-sky-400 border-sky-500/30 focus:ring-sky-500",
    optionClasses: "text-sky-400 bg-slate-900 font-semibold",
  },
  READY: {
    label: "Готово",
    badgeClasses: "border-emerald-400/30 bg-emerald-400/40 text-emerald-200",
    selectClasses:
      "text-emerald-400 border-emerald-500/30 focus:ring-emerald-500",
    optionClasses: "text-emerald-400 bg-slate-900 font-semibold",
  },
  ARCHIVED: {
    label: "Архів",
    badgeClasses: "border-slate-500/40 bg-slate-700/60 text-slate-300",
    selectClasses: "text-gray-400 border-white/10 focus:ring-gray-500",
    optionClasses: "text-gray-400 bg-slate-900 font-normal",
  },
};

export const DASHBOARD_STATUS_OPTIONS: Array<{
  key: DashboardStatusFilter;
  label: string;
}> = [
  { key: "ALL", label: "Усі" },
  { key: "PENDING", label: "Очікують" },
  { key: "IN_PROGRESS", label: "В роботі" },
  { key: "READY", label: "Готові" },
  { key: "ARCHIVED", label: "Архів" },
];

export function isValidOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUS_VALUES.includes(value as OrderStatus);
}
