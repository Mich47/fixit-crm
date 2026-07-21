"use client";

import { pdf } from "@react-pdf/renderer";
import OrderPdfTemplate from "./OrderPdfTemplate";
import { useState } from "react";
import { SerializedOrder } from "@/app/services/orderServerService";

export default function PdfDownloadButtonInner({
  order,
}: {
  order: SerializedOrder;
}) {
  const [loading, setLoading] = useState(false);

  // 🌟 МАГІЧНА ФУНКЦІЯ: ГЕНЕРУЄ PDF ТІЛЬКИ ПРИ КЛІКУ!
  const handleAction = async (isDownload: boolean) => {
    setLoading(true);
    try {
      // 1. Генеруємо PDF в пам'яті суворо в момент натискання кнопки
      const doc = <OrderPdfTemplate key={order.id} order={order} />;
      const blob = await pdf(doc).toBlob();

      // 2. Створюємо безпечне посилання
      const fileUrl = URL.createObjectURL(blob);
      const fileName = `receipt_${order.id.slice(0, 8)}.pdf`;

      if (isDownload) {
        // Режим скачування файлу з ідеальним ім'ям
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Режим миттєвого перегляду у новій вкладці
        window.open(fileUrl, "_blank");
      }
    } catch (error) {
      console.error("Помилка обробки PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* 🖨️ КНОПКА 1: Перегляд у новій вкладці */}
      <button
        type="button"
        disabled={loading}
        onClick={() => handleAction(false)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/10 transition hover:bg-indigo-500 cursor-pointer flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.72 13.82l2.9-2.9m0 0l2.9 2.9m-2.9-2.9v6c0 1.1.9 2 2 2h5.02c1.1 0 2-.9 2-2V9.41c0-.53-.21-1.04-.59-1.41l-2.42-2.42c-.37-.38-.88-.59-1.41-.59H7.22c-1.1 0-2 .9-2 2v3"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
        </svg>
        {loading ? "Формування..." : "Перегляд квитанції"}
      </button>

      {/* 📥 КНОПКА 2: Пряме завантаження */}
      <button
        type="button"
        disabled={loading}
        onClick={() => handleAction(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="Завантажити PDF"
      >
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
      </button>
    </div>
  );
}
