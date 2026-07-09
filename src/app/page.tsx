"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      // Перенаправляємо клієнта на сторінку ЙОГО замовлення
      router.push(`/order/${orderId.trim()}`);
    }
  };

  return (
    <div className="mx-auto max-w-xl text-center mt-20 px-4">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Перевірка статусу ремонту
      </h1>
      <p className="mt-4 text-lg text-gray-400">
        Введіть номер вашої квитанції (ID заявки), щоб дізнатися поточний стан
        вашого пристрою в реальному часі.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-10 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          required
          placeholder="напр. e3b0c442-..."
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          type="submit"
          className="w-full sm:w-auto shrink-0 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition cursor-pointer"
        >
          Перевірити 🔍
        </button>
      </form>

      <div className="mt-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-5">
        💡 <strong>Для майстра:</strong> Щоб увійти в систему управління
        ремонтами, перейдіть у верхньому меню за посиланням
        <span className="font-bold text-white"> «Панель майстра»</span>.
      </div>
    </div>
  );
}
