import { prisma } from "@/lib/db";
import type { Order, OrderStatus } from "@/generated/prisma/client";

export interface OrderWithHistory extends Order {
  statusHistory: Array<{
    id: string;
    status: OrderStatus;
    changedAt: Date;
    note: string | null;
  }>;
}

export async function getOrderById(id: string): Promise<OrderWithHistory | null> {
  const normalizedId = id.trim();

  try {
    return await prisma.order.findFirst({
      where: {
        OR: [
          { id: normalizedId },
          { id: { startsWith: normalizedId } },
          { serialNumber: { equals: normalizedId } },
          { serialNumber: { contains: normalizedId, mode: "insensitive" } },
        ],
      },
      include: {
        statusHistory: {
          orderBy: { changedAt: "asc" },
        },
      },
    });
  } catch {
    throw new Error("Помилка бази даних при отриманні замовлення.");
  }
}

export async function getFilteredOrders(
  search?: string,
  status?: string,
  page = 1,
  limit = 10,
): Promise<{
  orders: Order[];
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}> {
  const normalizedSearch = search?.trim();
  const normalizedStatus = status && status !== "ALL" ? status : undefined;
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(25, Math.max(1, limit));
  const skip = (safePage - 1) * safeLimit;

  const whereCondition: Record<string, unknown> = {};

  if (normalizedStatus) {
    whereCondition.status = normalizedStatus;
  }

  if (normalizedSearch) {
    whereCondition.OR = [
      { clientName: { contains: normalizedSearch, mode: "insensitive" } },
      { clientPhone: { contains: normalizedSearch, mode: "insensitive" } },
      { deviceModel: { contains: normalizedSearch, mode: "insensitive" } },
      { description: { contains: normalizedSearch, mode: "insensitive" } },
      { id: { contains: normalizedSearch, mode: "insensitive" } },
      { serialNumber: { contains: normalizedSearch, mode: "insensitive" } },
    ];
  }

  try {
    const [orders, totalCount] = await prisma.$transaction([
      prisma.order.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
      }),
      prisma.order.count({ where: whereCondition }),
    ]);

    return {
      orders,
      totalCount,
      page: safePage,
      limit: safeLimit,
      hasMore: skip + orders.length < totalCount,
    };
  } catch {
    throw new Error("Помилка бази даних при отриманні замовлення за фільтром.");
  }
}

export async function getDashboardStats(): Promise<{
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  readyCount: number;
  archivedCount: number;
}> {
  const [totalCount, pendingCount, inProgressCount, readyCount, archivedCount] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "IN_PROGRESS" } }),
      prisma.order.count({ where: { status: "READY" } }),
      prisma.order.count({ where: { status: "ARCHIVED" } }),
    ]);

  return {
    totalCount,
    pendingCount,
    inProgressCount,
    readyCount,
    archivedCount,
  };
}
