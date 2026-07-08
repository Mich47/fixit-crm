import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Заявки" },
  { href: "/order/create", label: "Нова заявка" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <nav
        aria-label="Основна навігація"
        className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
      >
        <Link
          href="/dashboard"
          className="flex min-h-11 items-center gap-3 self-start"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-indigo-500 text-sm font-bold text-white">
            FI
          </span>
          <span className="text-base font-semibold text-white">FixIt CRM</span>
        </Link>

        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:border-transparent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
