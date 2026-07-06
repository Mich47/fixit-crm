"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { useState } from "react";

// axios.defaults.baseURL = process.env.DATABASE_URL || "http://localhost:3000";

export default function CreateOrderPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  //const [email, setEmail] = useState("");
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
      const response = await axios.post("/api/orders", {
        clientName: `${firstName} ${lastName}`,
        clientPhone,
        deviceModel,
        description,
      });

      console.log("Відповідь сервера:", response.data);

      // Якщо все успішно — очищуємо форму
      setMessage("✅ Заявку успішно створено в базі даних!");
      setFirstName("");
      setLastName("");
      setClientPhone("");
      setDeviceModel("");
      setDescription("");
    } catch (error) {
      let errorMessage = "Сталася помилка при створенні заявки.";
      // 1. Перевіряємо, чи помилка прийшла саме від Axios
      if (axios.isAxiosError(error)) {
        // За допомогою безпечного приведення типів (as) дістаємо текст помилки з нашого сервера
        const serverData = error.response?.data as { error?: string };
        errorMessage = serverData?.error || error.message;
      }
      // 2. Якщо це звичайна помилка JavaScript (наприклад, збій мережі)
      else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessage(`❌ Помилка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          Заявка на ремонт
        </h2>
        <p className="mt-2 text-lg/8 text-gray-400">
          Створіть заявку на ремонт заповнивши усі поля форми.
        </p>
      </div>
      <form
        action="#"
        method="POST"
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm/6 font-semibold text-white"
            >
              Ім&apos;я
            </label>
            <div className="mt-2.5">
              <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm/6 font-semibold text-white"
            >
              Прізвище
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm/6 font-semibold text-white"
            >
              Номер телефону
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country"
                    aria-label="Country"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-transparent py-2 pr-7 pl-3.5 text-base text-gray-400 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  >
                    <option>UA</option>
                    <option>CA</option>
                    <option>EU</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
                  />
                </div>
                <input
                  id="phone-number"
                  name="phone-number"
                  type="text"
                  placeholder="098-765-4321"
                  className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="deviceModel"
              className="block text-sm/6 font-semibold text-white"
            >
              Модель пристрою
            </label>
            <div className="mt-2.5">
              <input
                id="deviceModel"
                name="deviceModel"
                type="text"
                placeholder="напр. iPhone 13, Велосипед Trek"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm/6 font-semibold text-white"
            >
              Опис поломки
            </label>
            <div className="mt-2.5">
              <textarea
                id="description"
                name="description"
                rows={4}
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            disabled={loading}
            className="block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {loading ? "Відправка..." : "Зберегти в CRM"}
          </button>
        </div>
      </form>
      {message && (
        <p className="mt-6 text-sm font-medium text-center p-3 rounded-md bg-white/10 text-white max-w-xl mx-auto">
          {message}
        </p>
      )}
    </>
  );
}
