"use client";
import { useRouter } from "next/navigation";
import { Order } from "../../generated/prisma/client";
import { updateOrderStatus } from "../services/orderService";

interface OrderTableProps {
  orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();

  const handleSelectChange = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);

      router.refresh(); // Оновлюємо серверні дані на сторінці без перезавантаження сайту!
    } catch (error) {
      console.error("Не вдалося оновити статус: ", error);
      alert("Помилка при оновлені статусу");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-gray-300">
        <thead className="bg-white/5 text-xs font-semibold uppercase text-gray-400 tracking-wider">
          <tr>
            <th className="px-6 py-4">Пристрій</th>
            <th className="px-6 py-4">Клієнт</th>
            <th className="px-6 py-4">Телефон</th>
            <th className="px-6 py-4">Опис поломки</th>
            <th className="px-6 py-4">Статус</th>
            <th className="px-6 py-4">Дата</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map(
            ({
              id,
              clientName,
              clientPhone,
              deviceModel,
              description,
              status,
              createdAt,
            }) => (
              <tr key={id} className="hover:bg-white/5 transition">
                <td className="px-6 py-4 font-semibold text-white">
                  {deviceModel}
                </td>
                <td className="px-6 py-4">{clientName}</td>
                <td className="px-6 py-4 text-gray-400">{clientPhone}</td>
                <td className="px-6 py-4 max-w-xs truncate">{description}</td>
                <td className="px-6 py-4">
                  <select
                    value={status}
                    onChange={(e) => handleSelectChange(id, e.target.value)}
                    className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="PENDING">Очікує</option>
                    <option value="IN_PROGRESS">В роботі</option>
                    <option value="READY">Готово</option>
                    <option value="ARCHIVED">Архів</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(createdAt).toLocaleDateString("uk-UA")}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
