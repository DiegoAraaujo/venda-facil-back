import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClient = (
  full_name: string,
  address: string,
  whatsApp: string,
) => {
  return prisma.client.create({ data: { full_name, address, whatsApp } });
};
