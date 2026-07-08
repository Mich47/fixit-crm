import { prisma } from "@/lib/db";
import type { Order } from "@/generated/prisma/client";

export async function getOrderById(id: string): Promise<Order | null> {
  return prisma.order.findUnique({
    where: { id },
  });
}
