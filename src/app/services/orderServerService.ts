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

export async function getFilteredOrders(
  search?: string,
  status?: string,
): Promise<Order[] | null> {
  const whereCondition: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    whereCondition.status = status;
  }

  if (search) {
    whereCondition.OR = [
      { clientName: { contains: search, mode: "insensitive" } },
      { deviceModel: { contains: search, mode: "insensitive" } },
    ];
  }

  console.log("whereCondition ", whereCondition);

  try {
    return await prisma.order.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Помилка серверного сервісу при пошуку за фільтром:", error);
    throw new Error("Помилка бази даних при отриманні замовлення за фільтром.");
  }
}

export async function getDashboardStats(): Promise<{
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  readyCount: number;
}> {
  // Завантажуємо статистику KPI (лічильники залишаються завжди точними!)
  const [totalCount, pendingCount, inProgressCount, readyCount] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "IN_PROGRESS" } }),
      prisma.order.count({ where: { status: "READY" } }),
    ]);

  return { totalCount, pendingCount, inProgressCount, readyCount };
}
