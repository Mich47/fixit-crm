import type { Order } from "@/generated/prisma/client";
import axios from "axios";

// export type CreateOrderDto = Omit<Order, "id" | "status" | "createdAt">;
export type CreateOrderDto = {
  clientName: string;
  clientPhone: string;
  deviceModel: string;
  description: string;
  estimatedPrice: number | null;
  serialNumber: string | null;
  notes: string | null;
};

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const serverData = error.response?.data as { error?: string };
    return serverData?.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
): Promise<void> => {
  try {
    await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
  } catch (error) {
    console.error("Помилка сервісу при оновленні статусу:", error);
    const errorMessage = handleAxiosError(
      error,
      "Сталася помилка при оновленні статусу.",
    );

    throw new Error(errorMessage);
  }
};

export const createOrder = async (order: CreateOrderDto): Promise<Order> => {
  try {
    const response = await axios.post("/api/orders", order);

    return response.data;
  } catch (error) {
    console.error("Помилка сервісу при створенні заявки:", error);
    const errorMessage = handleAxiosError(
      error,
      "Сталася помилка при створенні заявки.",
    );

    throw new Error(errorMessage);
  }
};
