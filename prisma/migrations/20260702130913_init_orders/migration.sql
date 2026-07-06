-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "deviceModel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
