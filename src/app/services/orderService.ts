import { Order } from "@/generated/prisma/client";
import axios from "axios";

// const handleAxiosError = (error: unknown, defaultMessage: string): string => {
//     let errorMessage = defaultMessage;
// }
export const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
): Promise<void> => {
  try {
    await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
  } catch (error) {
    console.error("Помилка сервісу при оновленні статусу: ", error);
    throw error; // Прокидаємо помилку далі, щоб її можна було обробити на фронтенді
  }
};

export const createOrder = async ({
  clientName,
  clientPhone,
  deviceModel,
  description,
}: Omit<Order, "id" | "status" | "createdAt">): Promise<Order> => {
  try {
    const response = await axios.post("/api/orders", {
      clientName,
      clientPhone,
      deviceModel,
      description,
    });

    console.log("Відповідь сервера:", response.data);
    return response.data;
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
    console.error("Помилка сервісу при створенні заявки: ", error);
    throw new Error(errorMessage);
  }
};
