"use client";

import { createOrder } from "@/app/services/orderService";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateOrderPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await createOrder({
        clientName: `${firstName} ${lastName}`.trim(),
        clientPhone,
        deviceModel,
        description,
      });

      router.push(`/order/${data.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Сталася невідома помилка.";

      setMessage(`Помилка: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-300">
          Нова заявка
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Заявка на ремонт
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Заповніть дані клієнта, пристрій і короткий опис проблеми.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 sm:mt-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold text-white"
            >
              Ім&apos;я
            </label>
            <input
              id="first-name"
              name="first-name"
              type="text"
              autoComplete="given-name"
              required
              className="mt-2 block min-h-11 w-full rounded-md border border-slate-700 bg-slate-900 px-3.5 py-2 text-base text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold text-white"
            >
              Прізвище
            </label>
            <input
              id="last-name"
              name="last-name"
              type="text"
              autoComplete="family-name"
              required
              className="mt-2 block min-h-11 w-full rounded-md border border-slate-700 bg-slate-900 px-3.5 py-2 text-base text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold text-white"
            >
              Номер телефону
            </label>
            <div className="mt-2 flex rounded-md border border-slate-700 bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-500">
              <div className="grid shrink-0 grid-cols-1">
                <select
                  id="country"
                  name="country"
                  autoComplete="country"
                  aria-label="Країна"
                  className="col-start-1 row-start-1 min-h-11 w-full appearance-none rounded-md bg-transparent py-2 pl-3.5 pr-7 text-base text-slate-300 outline-none"
                >
                  <option>UA</option>
                  <option>CA</option>
                  <option>EU</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-slate-400 sm:size-4"
                />
              </div>
              <input
                id="phone-number"
                name="phone-number"
                type="tel"
                placeholder="098-765-4321"
                required
                className="block min-h-11 min-w-0 grow bg-transparent py-2 pl-1 pr-3 text-base text-white outline-none placeholder:text-slate-500"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="deviceModel"
              className="block text-sm font-semibold text-white"
            >
              Модель пристрою
            </label>
            <input
              id="deviceModel"
              name="deviceModel"
              type="text"
              placeholder="наприклад: iPhone 13 або Trek Marlin"
              required
              className="mt-2 block min-h-11 w-full rounded-md border border-slate-700 bg-slate-900 px-3.5 py-2 text-base text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-white"
            >
              Опис поломки
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="mt-2 block min-h-32 w-full rounded-md border border-slate-700 bg-slate-900 px-3.5 py-3 text-base text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 block min-h-12 w-full rounded-md bg-indigo-500 px-3.5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {loading ? "Збереження..." : "Зберегти в CRM"}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-center text-sm font-medium text-red-200">
          {message}
        </p>
      )}
    </div>
  );
}
