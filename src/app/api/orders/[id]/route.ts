import { prisma } from "@/lib/db";
import { isValidOrderStatus } from "@/app/orders/status";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = typeof body?.status === "string" ? body.status.trim() : "";

    if (!status || !isValidOrderStatus(status)) {
      return NextResponse.json(
        { error: "Недопустимий статус заявки." },
        { status: 400 },
      );
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: order.status,
          note: `Статус змінено на ${status}`,
        },
      });

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch {
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 },
    );
  }
}
