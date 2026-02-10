import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findSubcategoriesByCategoryId = (id: number) => {
  return prisma.subcategory.findMany({
    where: { category_id: id, deleted_at: null },
    select: {
      id: true,
      name: true,
    },
  });
};

export const createSubcategory = (category_id: number, name: string) => {
  return prisma.subcategory.create({
    data: { name, category_id },
    select: {
      id: true,
      name: true,
    },
  });
};

export const deleteSubcategory = (subcategoryId: number) => {
  return prisma.subcategory.update({
    where: { id: subcategoryId },
    data: { deleted_at: new Date() },
  });
};

export const subcategoryNameExists = (
  store_id: number,
  category_id: number,
  name: string,
) => {
  return prisma.subcategory.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      category_id,
      deleted_at: null,
      category: {
        store_id,
        deleted_at: null,
      },
    },
  });
};

export const updateSubcategory = (subcategoryId: number, newName: string) => {
  return prisma.subcategory.update({
    where: { id: subcategoryId, deleted_at: null },
    data: {
      name: newName,
    },
  });
};

export const getCategoryOfSubcategory = (subcategoryId: number) => {
  return prisma.subcategory.findFirst({
    where: {
      id: subcategoryId,
      deleted_at: null,
      category: {
        deleted_at: null,
      },
    },
    select: {
      category_id: true,
    },
  });
};
