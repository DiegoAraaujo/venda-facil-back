import { PrismaClient } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

export const countVisitsInMonth = (storeId: number) => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  return prisma.visit.count({
    where: {
      storeId,
      visitDate: {
        gte: start,
        lte: end,
      },
    },
  });
};
