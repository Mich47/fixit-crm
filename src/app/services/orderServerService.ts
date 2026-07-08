import { prisma } from "@/lib/db";
import type { Order } from "@/generated/prisma/client";

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    return await prisma.order.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Помилка серверного сервісу при пошуку замовлення:", error);
    throw new Error("Помилка бази даних при отриманні замовлення.");
  }
}
