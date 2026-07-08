import type { Order } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    return await prisma.order.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Помилка серверного сервісу при пошуку заявки:", error);
    throw new Error("Помилка бази даних при отриманні заявки.");
  }
}
