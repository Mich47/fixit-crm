"use client";

import { SerializedOrder } from "@/app/services/orderServerService";
import dynamic from "next/dynamic";

// 🌟 ЗАЛІЗОБЕТОННИЙ ФІКС ДЛЯ NEXT.JS:
// Динамічно імпортуємо внутрішню кнопку і повністю вимикаємо SSR на рівні клієнтської обгортки.
// Тепер сервер Next.js ніколи в житті не побачить хук usePDF при F5 оновленні сторінки!
const PdfDownloadButtonInner = dynamic(
  () => import("./PdfDownloadButtonInner"),
  {
    ssr: false, // Намертво забороняє серверний рендер для цієї зони
    loading: () => (
      <button
        disabled
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-bold text-gray-400 cursor-not-allowed"
      >
        Завантаження квитанції...
      </button>
    ),
  },
);

export default function PdfDownloadButton({
  order,
}: {
  order: SerializedOrder;
}) {
  return <PdfDownloadButtonInner order={order} />;
}
