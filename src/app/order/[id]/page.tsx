import { getOrderById } from "@/app/services/orderServerService";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusStyles: Record<string, string> = {
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  IN_PROGRESS: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  READY: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  ARCHIVED: "border-slate-500/40 bg-slate-700/40 text-slate-300",
};

const statusLabels: Record<string, string> = {
  PENDING: "Очікує",
  IN_PROGRESS: "В роботі",
  READY: "Готово",
  ARCHIVED: "Архів",
};

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const createdAt = new Date(order.createdAt).toLocaleString("uk-UA", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
            Заявка #{order.id.slice(0, 8)}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Деталі ремонту
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Інформація про клієнта, пристрій і поточний стан заявки.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400/60 hover:text-white"
        >
          ← До списку заявок
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
                Пристрій
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {order.deviceModel}
              </h2>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                statusStyles[order.status] ?? statusStyles.PENDING
              }`}
            >
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-medium text-slate-400">Клієнт</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {order.clientName}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-medium text-slate-400">Телефон</p>
              <a
                href={`tel:${order.clientPhone}`}
                className="mt-2 flex min-h-11 items-center text-lg font-semibold text-sky-300 transition hover:text-sky-200"
              >
                {order.clientPhone}
              </a>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
            <p className="text-sm font-medium text-slate-400">Опис проблеми</p>
            <p className="mt-3 text-base leading-7 text-slate-300">
              {order.description}
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white">
              Коротка інформація
            </h3>
            <dl className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-400">Статус</dt>
                <dd className="font-medium text-white">
                  {statusLabels[order.status] ?? order.status}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-400">Створено</dt>
                <dd className="text-right font-medium text-white">
                  {createdAt}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-slate-400">ID заявки</dt>
                <dd className="break-all font-mono text-xs text-slate-300">
                  {order.id}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
              Наступний крок
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Оновіть статус у панелі заявок, коли майстер візьме ремонт у
              роботу або пристрій буде готовий до видачі.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
