import { PrismaClient } from "@prisma/client";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

const prisma = new PrismaClient();

export const getWeeklyPurchases = (storeId: number) => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  return prisma.orderProduct.findMany({
    where: {
      purchase: {
        store_id: storeId,
        status: "COMPLETED",
        created_at: {
          gte: start,
          lte: end,
        },
      },
    },
    include: {
      purchase: true,
    },
  });
};

export const getMonthlyRevenue = (storeId: number) => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  return prisma.orderProduct.findMany({
    where: {
      purchase: {
        store_id: storeId,
        status: "COMPLETED",
        created_at: { gte: start, lte: end },
      },
    },
    select: {
      price: true,
      quantity: true,
    },
  });
};

export const deleteOrderProduct = (orderProductId: number) => {
  return prisma.orderProduct.update({
    where: { id: orderProductId },
    data: { deleted_at: new Date() },
  });
};

export const getOrderItemById = (orderItemId: number) => {
  return prisma.orderProduct.findUnique({
    where: { id: orderItemId },
    select: {
      id: true,
      purchase_id: true,
      deleted_at: true,
    },
  });
};

export const countOrderItemsByPurchase = (purchaseId: number) => {
  return prisma.orderProduct.count({
    where: {
      purchase_id: purchaseId,
      deleted_at: null,
    },
  });
};
