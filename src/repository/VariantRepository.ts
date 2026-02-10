import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getVariants = (variantIds: number[]) => {
  return prisma.variant.findMany({
    where: {
      id: { in: variantIds },
      deleted_at: null,
      product: {
        deleted_at: null,
      },
    },
    include: {
      product: true,
    },
  });
};

export const getCartVariants = (variantIds: number[]) => {
  return prisma.variant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          deleted_at: true,
          images: { where: { is_cover: true }, select: { url: true } },
        },
      },
    },
  });
};

export const updateVariants = async (
  data: {
    id: number;
    stock: number;
    deleted_at: Date | null;
  }[],
) => {
  return prisma.$transaction(
    data.map((variant) =>
      prisma.variant.update({
        where: { id: variant.id },
        data: {
          stock: variant.stock,
          deleted_at: variant.deleted_at,
        },
      }),
    ),
  );
};
