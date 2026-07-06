import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

// Функція, яка створює клієнт з вашим адаптером
const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

// Оголошуємо глобальну змінну для збереження підключення в пам'яті Node.js
declare const globalThis: {
  prismaGlobal: ReturnType<typeof createPrismaClient>;
} & typeof global;

// Якщо в пам'яті вже є підключення — беремо його, якщо немає — створюємо нове
const prisma = globalThis.prismaGlobal ?? createPrismaClient();

export { prisma };

// У режимі розробки зберігаємо підключення глобально, щоб воно не перестворювалося
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
