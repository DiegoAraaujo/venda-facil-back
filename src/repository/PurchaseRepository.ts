import { PrismaClient, PurchaseStatus } from "@prisma/client";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

const prisma = new PrismaClient();

export const countSales = (storeId: number) => {
  return prisma.purchase.count({
    where: { store_id: storeId, status: "COMPLETED" },
  });
};

export const countOrders = (storeId: number, status: PurchaseStatus) => {
  return prisma.purchase.count({
    where: { store_id: storeId, status },
  });
};

export const getMonthlyOrdersCount = (storeId: number) => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  return prisma.purchase.count({
    where: {
      store_id: storeId,
      created_at: {
        gte: start,
        lte: end,
      },
    },
  });
};

export const getMonthlySalesCount = (storeId: number) => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  return prisma.purchase.count({
    where: {
      store_id: storeId,
      created_at: {
        gte: start,
        lte: end,
      },
      status: "COMPLETED",
    },
  });
};

export const getWeeklyPurchasesCount = (storeId: number) => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  return prisma.purchase.findMany({
    where: {
      store_id: storeId,
      created_at: { gte: start, lte: end },
    },
  });
};
export const getLatestPurchases = (storeId: number) => {
  return prisma.purchase.findMany({
    where: {
      store_id: storeId,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 4,
    select: {
      status: true,

      client: {
        select: {
          full_name: true,
        },
      },

      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
        },
      },
    },
  });
};

export const createPurchase = async (
  storeId: number,
  clientId: number,
  items: {
    variantId: number;
    quantity: number;
    price: number;
    color: string | null;
    size: string;
  }[],
) => {
  return prisma.purchase.create({
    data: {
      store_id: storeId,
      client_id: clientId,
      items: {
        create: items.map((item) => ({
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        })),
      },
    },
  });
};

export const getPurchaseByStoreId = (
  storeId: number,
  status: PurchaseStatus,
  skip: number,
  perPage: number,
) => {
  return prisma.purchase.findMany({
    where: { store_id: storeId, status },
    skip,
    take: perPage,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      created_at: true,
      status: true,
      client: {
        select: {
          full_name: true,
          address: true,
          whatsApp: true,
        },
      },
      items: {
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          price: true,
          quantity: true,
          color: true,
          size: true,
          variant: {
            select: {
              id: true,
              stock: true,
              deleted_at: true,
              product: {
                select: {
                  name: true,
                  deleted_at: true,
                  images: {
                    where: { is_cover: true },
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const updatePurchaseStatus = (id: number, status: PurchaseStatus) => {
  return prisma.purchase.update({
    where: { id },
    data: {
      status,
    },
    select: {
      items: {
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          quantity: true,
          variant: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
};

export const getVariantIdsByPurchase = (purchaseId: number) => {
  return prisma.orderProduct.findMany({
    where: { purchase_id: purchaseId, deleted_at: null },
    select: {
      variant_id: true,
      quantity: true,
    },
  });
};

export const getPurchaseStatus = (purchaseId: number) => {
  return prisma.purchase.findUnique({
    where: { id: purchaseId },
    select: {
      status: true,
    },
  });
};

export const decrementVariantStock = (variantId: number, quantity: number) => {
  return prisma.variant.update({
    where: {
      id: variantId,
    },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });
};
