import Link from "next/link";
import OrderTable from "./OrderTable";
import DashboardFilters from "./DashboardFilters";
import { getKPI, searchOrderByFilter } from "../services/orderServerService";

interface DashboardProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function DashBoardPage({ searchParams }: DashboardProps) {
  const { search, status } = await searchParams;

  const orders = await searchOrderByFilter(search, status);

  const { totalCount, pendingCount, inProgressCount, readyCount } =
    await getKPI();

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
      name: "Готові 🎉",
      value: readyCount,
      color: "text-emerald-400 border-emerald-500/20",
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
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
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
