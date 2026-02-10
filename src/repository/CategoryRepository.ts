import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = (store_id: number, name: string) => {
  return prisma.category.create({ data: { name, store_id } });
};

export const findCategoryByStore = (store_id: number) => {
  return prisma.category.findMany({
    where: { store_id, deleted_at: null },
    select: {
      id: true,
      name: true,
      subcategories: {
        where: { deleted_at: null },
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const deleteCategoryById = async (categoryId: number) => {
  const now = new Date();

  return prisma.$transaction([
    prisma.category.update({
      where: { id: categoryId },
      data: { deleted_at: now },
    }),

    prisma.subcategory.updateMany({
      where: {
        category_id: categoryId,
        deleted_at: null,
      },
      data: { deleted_at: now },
    }),

    prisma.product.updateMany({
      where: {
        category_id: categoryId,
        deleted_at: null,
      },
      data: { deleted_at: now },
    }),

    prisma.variant.updateMany({
      where: {
        product: {
          category_id: categoryId,
        },
        deleted_at: null,
      },
      data: { deleted_at: now },
    }),
  ]);
};

export const categoryNameExists = (store_id: number, name: string) => {
  return prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      store_id,
      deleted_at: null,
    },
  });
};

export const updateCategory = (categoryId: number, newName: string) => {
  return prisma.category.update({
    where: { id: categoryId},
    data: { name: newName },
  });
};
