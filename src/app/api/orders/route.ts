import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const normalizeText = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const normalizePhone = (value: string) => value.replace(/\D/g, "");

const parseDecimal = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Некоректний формат запиту." },
        { status: 400 },
      );
    }

    const clientName = normalizeText(body.clientName);
    const clientPhone = normalizeText(body.clientPhone);
    const deviceModel = normalizeText(body.deviceModel);
    const description = normalizeText(body.description);
    const deviceType = normalizeText(body.deviceType);
    const serialNumber = normalizeText(body.serialNumber);
    const notes = normalizeText(body.notes);
    const priority = normalizeText(body.priority) || "NORMAL";

    if (!clientName || clientName.length < 2 || clientName.length > 80) {
      return NextResponse.json(
        { error: "Ім'я клієнта має бути від 2 до 80 символів." },
        { status: 400 },
      );
    }

    if (!deviceModel || deviceModel.length < 2 || deviceModel.length > 120) {
      return NextResponse.json(
        { error: "Модель пристрою має бути від 2 до 120 символів." },
        { status: 400 },
      );
    }

    if (!description || description.length < 5 || description.length > 1000) {
      return NextResponse.json(
        { error: "Опис поломки має бути від 5 до 1000 символів." },
        { status: 400 },
      );
    }

    const normalizedPhone = normalizePhone(clientPhone);
    if (normalizedPhone.length < 9 || normalizedPhone.length > 15) {
      return NextResponse.json(
        { error: "Введіть коректний номер телефону." },
        { status: 400 },
      );
    }

    if (!["LOW", "NORMAL", "HIGH"].includes(priority)) {
      return NextResponse.json(
        { error: "Недопустимий пріоритет заявки." },
        { status: 400 },
      );
    }

    const estimatedPrice = parseDecimal(body.estimatedPrice);
    const finalPrice = parseDecimal(body.finalPrice);

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          clientName,
          clientPhone: normalizedPhone,
          deviceModel,
          description,
          status: "PENDING",
          serialNumber: serialNumber || null,
          deviceType: deviceType || null,
          priority,
          notes: notes || null,
          estimatedPrice: estimatedPrice ? estimatedPrice : null,
          finalPrice: finalPrice ? finalPrice : null,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: order.status,
          note: "Заявку створено",
        },
      });

      return order;
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 },
    );
  }
}
