"use client";

import { useState } from "react";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 mb-0 border-b border-white/10 bg-gray-900/80 backdrop-blur">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        {/* Логотип CRM */}
        <div className="flex lg:flex-1">
          <Link
            href="/dashboard"
            className="-m-1.5 p-1.5 text-xl font-bold text-white tracking-tight hover:text-indigo-400 transition"
          >
            FixIt <span className="text-indigo-500">CRM</span>
          </Link>
        </div>

        {/* Кнопка відкриття мобільного меню */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Десктопна навігація (Ховаємо зайве, ставимо реальні пункти) */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link
            href="/"
            className="text-sm/6 font-semibold text-white hover:text-indigo-400 transition"
          >
            Головна
          </Link>
          <Link
            href="/dashboard"
            className="text-sm/6 font-semibold text-white hover:text-indigo-400 transition"
          >
            Панель майстра
          </Link>
          <Link
            href="/order/create"
            className="text-sm/6 font-semibold text-white hover:text-indigo-400 transition"
          >
            Нова заявка
          </Link>
        </PopoverGroup>

        {/* Права частина десктопу (Тут можна вивести, наприклад, статус бази чи просто заглушку) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
            Система Online
          </span>
        </div>
      </nav>

      {/* Мобільне меню (Діалогове вікно) */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-1.5 p-1.5 text-xl font-bold text-white"
            >
              FixIt <span className="text-indigo-500">CRM</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              {/* Мобільні посилання */}
              <div className="space-y-2 py-6">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                >
                  Головна
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                >
                  Панель майстра
                </Link>
                <Link
                  href="/order/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                >
                  Нова заявка
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
