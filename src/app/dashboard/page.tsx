import Link from "next/link";
import OrderTable from "./OrderTable";
import DashboardFilters from "./DashboardFilters";
import {
  getDashboardStats,
  getFilteredOrders,
} from "../services/orderServerService";

interface DashboardProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function DashBoardPage({ searchParams }: DashboardProps) {
  const { search, status, page } = await searchParams;
  const currentPage = Number.parseInt(page ?? "1", 10) || 1;

  const [statsData, filteredOrdersResult] = await Promise.all([
    getDashboardStats(),
    getFilteredOrders(search, status, currentPage, 10),
  ]);

  const {
    totalCount,
    pendingCount,
    inProgressCount,
    readyCount,
    archivedCount,
  } = statsData;

  const {
    orders,
    totalCount: totalFilteredCount,
    page: resolvedPage,
    hasMore,
  } = filteredOrdersResult;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / 10));

  const buildPageHref = (nextPage: number) => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (status) {
      params.set("status", status);
    }

    params.set("page", String(nextPage));
    return `/dashboard?${params.toString()}`;
  };

  const stats = [
    {
      name: "Всього заявок",
      value: totalCount,
      color: "text-indigo-400 border-indigo-500/20",
    },
    {
      name: "Очікують",
      value: pendingCount,
      color: "text-amber-400 border-amber-500/20",
    },
    {
      name: "В роботі",
      value: inProgressCount,
      color: "text-sky-400 border-sky-500/20",
    },
    {
      name: "Готові",
      value: readyCount,
      color: "text-emerald-400 border-emerald-500/20",
    },
    {
      name: "Архів",
      value: archivedCount,
      color: "text-slate-400 border-slate-500/20",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Шапка адмінки */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Панель майстра
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Керування ремонтами, оновлення статусів та аналітика черги в
            реальному часі.
          </p>
        </div>
        <Link
          href="/order/create"
          className="block sm:inline-block text-center rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition"
        >
          + Nova заявка
        </Link>
      </div>

      {/* Картки KPI аналітики */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`rounded-xl border bg-white/5 p-4 shadow-sm ${stat.color}`}
          >
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {stat.name}
            </p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 🌟 НАШІ НОВІ ФІЛЬТРИ */}
      <DashboardFilters />

      {/* Таблиця або Картки замовлень */}
      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-10 bg-white/5 rounded-lg border border-white/10">
          Нічого не знайдено за такими критеріями пошуку.
        </p>
      ) : (
        <>
          <OrderTable orders={orders} />
          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
              <p>
                Сторінка {resolvedPage} з {totalPages} · показано{" "}
                {orders.length} із {totalFilteredCount}
              </p>
              <div className="flex gap-2">
                <Link
                  href={buildPageHref(Math.max(1, resolvedPage - 1))}
                  className={`rounded-md border border-white/10 px-3 py-2 transition ${resolvedPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-white/10"}`}
                >
                  ← Назад
                </Link>
                <Link
                  href={buildPageHref(Math.min(totalPages, resolvedPage + 1))}
                  className={`rounded-md border border-white/10 px-3 py-2 transition ${!hasMore ? "pointer-events-none opacity-40" : "hover:bg-white/10"}`}
                >
                  Далі →
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
