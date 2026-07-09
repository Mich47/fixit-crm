import type { Order } from "@/generated/prisma/client";
import axios from "axios";

export interface CreateOrderInput {
  clientName: string;
  clientPhone: string;
  deviceModel: string;
  description: string;
  serialNumber?: string;
  deviceType?: string;
  priority?: string;
  estimatedPrice?: number | string | null;
  finalPrice?: number | string | null;
  notes?: string;
}

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
    const errorMessage = handleAxiosError(
      error,
      "Сталася помилка при оновленні статусу.",
    );

    throw new Error(errorMessage);
  }
};

export const createOrder = async (
  payload: CreateOrderInput,
): Promise<Order> => {
  try {
    const response = await axios.post("/api/orders", payload);

    return response.data;
  } catch (error) {
    const errorMessage = handleAxiosError(
      error,
      "Сталася помилка при створенні заявки.",
    );

    throw new Error(errorMessage);
  }
};
