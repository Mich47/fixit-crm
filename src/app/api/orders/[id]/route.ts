import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // 1. Отримуємо ID замовлення з URL
    const { id } = await params;
    const { status } = await request.json();

    // 2. Перевіряємо, чи прийшов статус
    if (!status) {
      return NextResponse.json(
        { error: "Статус є обов'язковий" },
        { status: 400 },
      );
    }

    // 3. Оновлюємо статус замовлення в базі даних
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // 4. Повертаємо оновлене замовлення на фронтенд
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Помилка на бекенді при оновленні статусу:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 },
    );
  }
}
