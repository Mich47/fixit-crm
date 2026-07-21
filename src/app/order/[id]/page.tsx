import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/app/services/orderServerService";
import PdfDownloadButton from "./PdfDownloadButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusStyles: Record<string, string> = {
  PENDING:
    "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20",
  IN_PROGRESS:
    "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20",
  READY:
    "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 animate-pulse", // додасть легке пульсування
  ARCHIVED: "bg-slate-600 text-white font-medium opacity-70",
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
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Заявка #{order.id.slice(0, 8)}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Деталі ремонту
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Перегляд інформації про клієнта, пристрій та поточний стан заявки.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-indigo-400/40 hover:text-white"
        >
          ← До списку заявок
        </Link>
        {/* Кнопка друку квитанції */}
        <PdfDownloadButton order={order} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
                Пристрій
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {order.deviceModel}
              </h2>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[order.status] ?? statusStyles.PENDING}`}
            >
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-gray-400">Клієнт</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {order.clientName}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-gray-400">Телефон</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {order.clientPhone}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-gray-400">Опис проблеми</p>
            <p className="mt-3 text-base leading-7 text-gray-300">
              {order.description}
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white">
              Коротка інформація
            </h3>
            <dl className="mt-5 space-y-4 text-sm text-gray-300">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">Статус</dt>
                <dd className="font-medium text-white">
                  {statusLabels[order.status] ?? order.status}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">Створено</dt>
                <dd className="font-medium text-white">{createdAt}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">ID заявки</dt>
                <dd className="font-medium text-white">{order.id}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6 shadow-2xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
              Наступний крок
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Після підтвердження стану заявки її можна легко відслідковувати з
              панелі управління.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
