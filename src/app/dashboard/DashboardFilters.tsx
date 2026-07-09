"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DASHBOARD_STATUS_OPTIONS } from "@/app/orders/status";

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "ALL";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    if (searchTerm === currentSearch) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSearchTerm(currentSearch);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [currentSearch, searchTerm]);

  const hasActiveFilters = useMemo(
    () => Boolean(searchTerm.trim()) || currentStatus !== "ALL",
    [currentStatus, searchTerm],
  );

  useEffect(() => {
    const trimmed = searchTerm.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    const timer = window.setTimeout(() => {
      router.replace(`?${nextQuery}`, { scroll: false });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [router, searchParams, searchTerm]);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status !== "ALL") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("status");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex w-full items-center md:max-w-xs">
        <input
          type="text"
          placeholder="Пошук за клієнтом, телефоном, пристроєм..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-4 pr-10 text-sm text-white placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            aria-label="Очистити пошук"
            className="absolute right-3 rounded-full p-0.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
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

      <div className="flex flex-wrap items-center gap-2">
        {DASHBOARD_STATUS_OPTIONS.map((statusOption) => (
          <button
            key={statusOption.key}
            onClick={() => handleStatusChange(statusOption.key)}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
              currentStatus === statusOption.key
                ? "border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {statusOption.label}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            Очистити всі
          </button>
        )}
      </div>
    </div>
  );
}
