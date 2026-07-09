"use client";

import type { Order } from "@/generated/prisma/client";
import { ORDER_STATUS_META, ORDER_STATUS_VALUES } from "@/app/orders/status";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateOrderStatus } from "../services/orderService";

interface OrderTableProps {
  orders: Order[];
}

const STATUS_CONFIG = ORDER_STATUS_META;

// Розумне форматування дат (сьогодні/вчора/повна дата)
const timeFormatter = new Intl.DateTimeFormat("uk-UA", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatOrderDate(value: Date) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `сьогодні ${timeFormatter.format(date)}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `вчора ${timeFormatter.format(date)}`;
  }
  return dateFormatter.format(date);
}

// Окремий компонент красивої кольорової плашки
function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.badgeClasses}`}
    >
      {config.label}
    </span>
  );
}

export default function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectChange = async (id: string, newStatus: string) => {
    setErrorMessage("");
    try {
      await updateOrderStatus(id, newStatus);
      router.refresh();
    } catch (error) {
      console.error("Не вдалося оновити статус:", error);
      setErrorMessage("Не вдалося оновити статус заявки. Спробуйте ще раз.");
    }
  };

  // Універсальний рендер селекта з автоматичним підбором кольору під колір картки/таблиці
  const renderStatusSelect = (
    id: string,
    status: string,
    isMobile: boolean,
  ) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
    const textColorClass = config.selectClasses.split(" ")[0];
    const backgroundColorClass = config.badgeClasses.split(" ")[1];

    return (
      <div className={`relative ${isMobile ? "w-full" : "inline-block"}`}>
        <select
          value={status}
          aria-label="Змінити статус заявки"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onChange={(event) => handleSelectChange(id, event.target.value)}
          className={`appearance-none rounded-md border  text-sm text-white outline-none transition focus:ring-2 ${config.selectClasses} ${backgroundColorClass} ${
            isMobile
              ? "w-full py-2.5 pl-3.5 pr-10 font-bold rounded-lg text-left"
              : "py-1 pl-2 pr-9 text-xs font-semibold lg:py-1 lg:text-xs"
          }`}
        >
          {ORDER_STATUS_VALUES.map((key) => (
            <option
              key={key}
              value={key}
              className={STATUS_CONFIG[key].optionClasses}
            >
              {STATUS_CONFIG[key].label}
            </option>
          ))}
        </select>

        {/* 🌟 НАША КАСТОМНА СТРІЛОЧКА */}
        {/* pointer-events-none каже браузеру: "ігноруй кліки по самій стрілочці, пропускай їх крізь неї прямо на селект" */}
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${textColorClass}`}
        >
          <svg
            className={`${isMobile ? "size-4" : "size-3.5"}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {errorMessage && (
        <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      )}

      {/* 📱 1. МОБІЛЬНА + ПЛАНШЕТНА ВЕРСІЯ: Сітка у 1, 2 або 3 стовпці до 1024px */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
        {orders.map(
          ({
            id,
            clientName,
            clientPhone,
            deviceModel,
            description,
            status,
            createdAt,
          }) => (
            <article
              key={id}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/order/${id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter") router.push(`/order/${id}`);
              }}
              className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900/80 p-4 transition active:scale-[0.99] active:bg-slate-800/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-white">
                      {deviceModel}
                    </h2>
                    <p className="mt-1 truncate text-sm text-slate-400">
                      {clientName}
                    </p>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">
                  {description}
                </p>
              </div>

              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span>{formatOrderDate(createdAt)}</span>
                  <span>#{id.slice(0, 8)}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href={`tel:${clientPhone}`}
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-sky-400/30 bg-sky-400/10 px-3 text-sm font-semibold text-sky-200 transition active:bg-sky-400/20"
                  >
                    {clientPhone}
                  </a>
                  {renderStatusSelect(id, status, true)}
                </div>
              </div>
            </article>
          ),
        )}
      </div>

      {/* 💻 2. ДЕСКТОПНА ВЕРСІЯ: Велика красива таблиця від 1024px */}
      <div className="hidden overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/70 lg:block">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-3">Пристрій</th>
              <th className="px-5 py-3">Клієнт</th>
              <th className="px-5 py-3">Телефон</th>
              <th className="px-5 py-3">Опис поломки</th>
              <th className="px-5 py-3">Статус</th>
              <th className="px-5 py-3">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map(
              ({
                id,
                clientName,
                clientPhone,
                deviceModel,
                description,
                status,
                createdAt,
              }) => (
                <tr
                  key={id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/order/${id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") router.push(`/order/${id}`);
                  }}
                  className="cursor-pointer transition hover:bg-slate-800/70 focus-visible:bg-slate-800/70 focus-visible:outline-none"
                >
                  <td className="px-5 py-4 font-semibold text-white">
                    {deviceModel}
                  </td>
                  <td className="px-5 py-4">{clientName}</td>
                  <td className="px-5 py-4">
                    <a
                      href={`tel:${clientPhone}`}
                      onClick={(event) => event.stopPropagation()}
                      className="font-medium text-sky-300 transition hover:text-sky-200"
                    >
                      {clientPhone}
                    </a>
                  </td>
                  <td className="max-w-xs truncate px-5 py-4 text-slate-400">
                    {description}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* <StatusBadge status={status} /> */}
                      {renderStatusSelect(id, status, false)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-400">
                    {formatOrderDate(createdAt)}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
