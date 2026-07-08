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
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-300">
            FixIt CRM
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Панель заявок
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Всі активні та завершені заявки на ремонт в одному робочому списку.
          </p>
        </div>
        <Link
          href="/order/create"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:w-auto"
        >
          + Нова заявка
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-10 text-center sm:px-6 sm:py-12">
          <h2 className="text-base font-semibold text-white">
            Заявок поки немає
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Створіть першу заявку, щоб почати вести ремонт у CRM.
          </p>
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
