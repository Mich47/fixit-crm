import { prisma } from "@/lib/db";
import Link from "next/link";
import OrderTable from "./OrderTable";

export default async function DashBoardPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="sm:flex sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Панель майстра
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Список усіх активних та завершених заявок на ремонт у системі.
          </p>
        </div>
        <Link
          href="/order/create"
          className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          + Нова заявка
        </Link>
      </div>

      {/* Якщо в базі немає замовлень */}
      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-10 bg-white/5 rounded-lg border border-white/10">
          Заявок поки немає. Створіть першу заявку через форму!
        </p>
      ) : (
        /* Таблиця замовлень на Tailwind */
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
