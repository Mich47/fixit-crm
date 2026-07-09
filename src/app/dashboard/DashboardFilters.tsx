"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Зчитуємо поточні значення з URL (якщо вони там є)
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "ALL";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const [previousSearch, setPreviousSearch] = useState(currentSearch);

  console.log("searchTerm ", searchTerm);
  console.log("previousSearch ", previousSearch);

  if (currentSearch !== previousSearch) {
    setPreviousSearch(currentSearch);
    setSearchTerm(currentSearch);
  }

  // ПАТЕРН ДЛЯ ЛІНТЕРА: Зберігаємо свіжі значення в useRef
  // Це дозволяє брати їх всередині useEffect без додавання в масив залежностей!
  const searchParamsRef = useRef(searchParams);
  const currentSearchRef = useRef(currentSearch);
  const routerRef = useRef(router);

  // 🌟 ОФІЦІЙНИЙ ПАТЕРН: Оновлюємо рефи ПІСЛЯ рендеру всередині ефекту
  useEffect(() => {
    searchParamsRef.current = searchParams;
    currentSearchRef.current = currentSearch;
    routerRef.current = router;
  }, [searchParams, currentSearch, router]);

  // Дебаунс (Debounce): щоб не смикати базу на кожну введену літеру,
  // чекаємо 400 мілісекунд після того, як користувач закінчив писати
  useEffect(() => {
    if (searchTerm === currentSearchRef.current) return; // Якщо значення не змінилося, нічого не робимо
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (searchTerm.trim()) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      routerRef.current.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Функція для зміни статусу по кліку на кнопку
  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status !== "ALL") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    router.push(`?${params.toString()}`, { scroll: false }); // scroll: false, щоб не скролити сторінку вгору при зміні статусу
  };

  const statuses = [
    { key: "ALL", label: "Усі" },
    { key: "PENDING", label: "Очікують" },
    { key: "IN_PROGRESS", label: "В роботі" },
    { key: "READY", label: "Готові 🎉" },
    { key: "ARCHIVED", label: "Архів" },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-6">
      {/* 🔍 Пошуковий інпут */}
      <div className="w-full md:max-w-xs relative flex items-center">
        <input
          type="text"
          placeholder="Пошук за клієнтом, пристроєм..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Додали pr-10 (відступ праворуч), щоб текст під час введення не залазив під хрестик
          className="w-full rounded-lg bg-white/5 border border-white/10 pl-4 pr-10 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        {/* Рендериться тільки якщо searchTerm не порожній */}
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")} // Миттєво стирає текст в інпуті
            aria-label="Очистити пошук"
            className="absolute right-3 text-gray-400 hover:text-white transition cursor-pointer p-0.5 rounded-full hover:bg-white/10"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 🔘 Кнопки-фільтри статусів */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.key}
            onClick={() => handleStatusChange(s.key)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold border transition cursor-pointer ${
              currentStatus === s.key
                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
