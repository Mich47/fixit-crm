import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientPhone, deviceModel, description } = body;

    if (!clientName || !clientPhone || !deviceModel || !description) {
      return NextResponse.json(
        { error: "Усі поля є обов'язковими для заповнення!" },
        { status: 400 },
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        clientName,
        clientPhone,
        deviceModel,
        description,
        status: "PENDING", // Статус за замовчуванням
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.log("Помилка на бекенді: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
