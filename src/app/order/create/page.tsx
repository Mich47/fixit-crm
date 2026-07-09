"use client";

import { createOrder } from "@/app/services/orderService";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateOrderPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [description, setDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return "Ім'я та прізвище обов'язкові.";
    }

    if (!clientPhone.trim()) {
      return "Номер телефону обов'язковий.";
    }

    const digits = normalizePhone(clientPhone);
    if (digits.length < 9) {
      return "Введіть коректний номер телефону.";
    }

    if (!deviceModel.trim()) {
      return "Модель пристрою обов'язкова.";
    }

    if (!description.trim()) {
      return "Опис поломки обов'язковий.";
    }

    if (estimatedPrice && Number.isNaN(Number(estimatedPrice))) {
      return "Орієнтовна вартість має бути числом.";
    }

    if (finalPrice && Number.isNaN(Number(finalPrice))) {
      return "Фінальна вартість має бути числом.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const validationError = validateForm();
    if (validationError) {
      setMessage(`❌ ${validationError}`);
      setLoading(false);
      return;
    }

    try {
      const normalizedPhone = normalizePhone(clientPhone);

      await createOrder({
        clientName: `${firstName} ${lastName}`,
        clientPhone: normalizedPhone,
        deviceModel,
        description,
        serialNumber: serialNumber.trim() || undefined,
        deviceType: deviceType.trim() || undefined,
        priority,
        estimatedPrice: estimatedPrice ? Number(estimatedPrice) : undefined,
        finalPrice: finalPrice ? Number(finalPrice) : undefined,
        notes: notes.trim() || undefined,
      });

      // Якщо все успішно — очищуємо форму і переходимо в адмінку
      setFirstName("");
      setLastName("");
      setClientPhone("");
      setDeviceModel("");
      setDescription("");
      setSerialNumber("");
      setDeviceType("");
      setPriority("NORMAL");
      setEstimatedPrice("");
      setFinalPrice("");
      setNotes("");
      setMessage("✅ Заявку успішно створено в базі даних!");
      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Сталася невідома помилка.";

      setMessage(`❌ Помилка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Заявка на ремонт
        </h2>
        <p className="mt-2 text-base text-gray-400">
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
              Ім&apos;я <span className="text-rose-400">*</span>
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
              Прізвище <span className="text-rose-400">*</span>
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
              Номер телефону <span className="text-rose-400">*</span>
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
              Модель пристрою <span className="text-rose-400">*</span>
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
              Опис поломки <span className="text-rose-400">*</span>
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

          <div>
            <label
              htmlFor="serial-number"
              className="block text-sm/6 font-semibold text-white"
            >
              Серійний номер
            </label>
            <div className="mt-2.5">
              <input
                id="serial-number"
                name="serial-number"
                type="text"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="device-type"
              className="block text-sm/6 font-semibold text-white"
            >
              Тип пристрою
            </label>
            <div className="mt-2.5">
              <input
                id="device-type"
                name="device-type"
                type="text"
                placeholder="Телефон, ноутбук, планшет"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm/6 font-semibold text-white"
            >
              Пріоритет
            </label>
            <div className="mt-2.5">
              <select
                id="priority"
                name="priority"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Низький</option>
                <option value="NORMAL">Звичайний</option>
                <option value="HIGH">Високий</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="estimated-price"
              className="block text-sm/6 font-semibold text-white"
            >
              Орієнтовна вартість
            </label>
            <div className="mt-2.5">
              <input
                id="estimated-price"
                name="estimated-price"
                type="number"
                min="0"
                step="0.01"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="final-price"
              className="block text-sm/6 font-semibold text-white"
            >
              Фінальна вартість
            </label>
            <div className="mt-2.5">
              <input
                id="final-price"
                name="final-price"
                type="number"
                min="0"
                step="0.01"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="notes"
              className="block text-sm/6 font-semibold text-white"
            >
              Примітки
            </label>
            <div className="mt-2.5">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
