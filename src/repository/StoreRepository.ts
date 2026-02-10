import { PrismaClient } from "@prisma/client";
import type { Store } from "../types/store";

const prisma = new PrismaClient();

export const createStore = (store: Store) => {
  return prisma.store.create({
    data: store,
    select: {
      id: true,
      name: true,
      banner: true,
      profile_photo: true,
      description: true,
      instagram: true,
      whatsApp: true,
      address: true,
    },
  });
};

export const findStoreByName = (name: string) => {
  return prisma.store.findUnique({ where: { name } });
};

export const findStoreById = (storeId: number) => {
  return prisma.store.findUnique({ where: { id: storeId } });
};

export const findStoreByEmail = (email: string) => {
  return prisma.store.findUnique({ where: { email } });
};

export const registerVisitRecord = (
  visitorId: string,
  storeId: number,
  visitDate: Date,
) => {
  return prisma.visit.create({
    data: {
      visitorId,
      storeId,
      visitDate,
    },
  });
};
