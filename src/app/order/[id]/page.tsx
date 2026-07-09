import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/app/services/orderServerService";
import { ORDER_STATUS_LABELS, ORDER_STATUS_META } from "@/app/orders/status";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusStyles = {
  PENDING:
    "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20",
  IN_PROGRESS:
    "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20",
  READY:
    "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 animate-pulse",
  ARCHIVED: "bg-slate-600 text-white font-medium opacity-70",
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
  const updatedAt = new Date(order.updatedAt).toLocaleString("uk-UA", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const statusKey = order.status as keyof typeof ORDER_STATUS_META;
  const statusLabel = ORDER_STATUS_LABELS[statusKey] ?? order.status;

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
              className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[order.status as keyof typeof statusStyles] ?? statusStyles.PENDING}`}
            >
              {statusLabel}
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
              <a
                href={`tel:${order.clientPhone}`}
                className="mt-2 block text-lg font-semibold text-sky-300 transition hover:text-sky-200"
              >
                {order.clientPhone}
              </a>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-gray-400">Опис проблеми</p>
            <p className="mt-3 text-base leading-7 text-gray-300">
              {order.description}
            </p>
          </div>

          {(order.serialNumber ||
            order.deviceType ||
            order.estimatedPrice ||
            order.finalPrice ||
            order.notes) && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-gray-400">Додатково</p>
              <dl className="mt-4 grid gap-3 text-sm text-gray-300 sm:grid-cols-2">
                {order.serialNumber ? (
                  <div>
                    <dt className="text-gray-500">Серійний номер</dt>
                    <dd className="mt-1 font-medium text-white">
                      {order.serialNumber}
                    </dd>
                  </div>
                ) : null}
                {order.deviceType ? (
                  <div>
                    <dt className="text-gray-500">Тип пристрою</dt>
                    <dd className="mt-1 font-medium text-white">
                      {order.deviceType}
                    </dd>
                  </div>
                ) : null}
                {order.estimatedPrice ? (
                  <div>
                    <dt className="text-gray-500">Орієнтовна вартість</dt>
                    <dd className="mt-1 font-medium text-white">
                      {Number(order.estimatedPrice).toLocaleString("uk-UA")} ₴
                    </dd>
                  </div>
                ) : null}
                {order.finalPrice ? (
                  <div>
                    <dt className="text-gray-500">Фінальна вартість</dt>
                    <dd className="mt-1 font-medium text-white">
                      {Number(order.finalPrice).toLocaleString("uk-UA")} ₴
                    </dd>
                  </div>
                ) : null}
                {order.notes ? (
                  <div className="sm:col-span-2">
                    <dt className="text-gray-500">Примітки</dt>
                    <dd className="mt-1 font-medium text-white">
                      {order.notes}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          )}

          {order.statusHistory.length > 0 && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-gray-400">
                Історія статусів
              </p>
              <ul className="mt-4 space-y-3">
                {order.statusHistory.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-col gap-1 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-medium text-white">
                      {ORDER_STATUS_LABELS[
                        entry.status as keyof typeof ORDER_STATUS_LABELS
                      ] ?? entry.status}
                    </span>
                    <span className="text-gray-400">
                      {new Date(entry.changedAt).toLocaleString("uk-UA", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white">
              Коротка інформація
            </h3>
            <dl className="mt-5 space-y-4 text-sm text-gray-300">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">Статус</dt>
                <dd className="font-medium text-white">{statusLabel}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">Створено</dt>
                <dd className="font-medium text-white">{createdAt}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-400">Оновлено</dt>
                <dd className="font-medium text-white">{updatedAt}</dd>
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
