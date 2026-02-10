import { PrismaClient } from "@prisma/client";
import { Product } from "../types/product";

const prisma = new PrismaClient();

export const FindProductsByStore = async (
  store_id: number,
  skip: number,
  take: number,
  category?: number,
  subcategory?: number,
  productName?: string,
) => {
  return prisma.product.findMany({
    where: {
      store_id,
      deleted_at: null,
      category_id: category,
      subcategory_id: subcategory,
      name: productName
        ? {
            contains: productName,
            mode: "insensitive",
          }
        : undefined,
    },
    skip,
    take,
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category_id: true,
      subcategory: true,
      variants: {
        where: { deleted_at: null },
        select: {
          id: true,
          color: true,
          size: true,
          stock: true,
        },
      },
      images: {
        select: {
          id: true,
          is_cover: true,
          url: true,
        },
      },
    },
  });
};

export const countProducts = async (
  storeId: number,
  category?: number,
  subcategory?: number,
  productName?: string,
) => {
  return prisma.product.count({
    where: {
      store_id: storeId,
      deleted_at: null,
      category_id: category,
      subcategory_id: subcategory,
      name: productName
        ? {
            contains: productName,
            mode: "insensitive",
          }
        : undefined,
    },
  });
};

export const createProduct = async (storeId: number, productData: Product) => {
  return prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      store_id: storeId,
      category_id: productData.category_id,
      subcategory_id: productData.subcategory_id ?? null,
      variants: {
        create: productData.variants?.map((v) => ({
          color: v.color,
          size: v.size,
          stock: v.stock,
        })),
      },
      images: {
        create: productData.images?.map((img) => ({
          url: img.url,
          is_cover: img.is_cover,
        })),
      },
    },
  });
};

export const getTopSellingProducts = async (storeId: number) => {
  const topProducts = await prisma.orderProduct.groupBy({
    by: ["variant_id"],
    where: {
      purchase: {
        store_id: storeId,
        status: "COMPLETED",
      },
    },
    _sum: {
      quantity: true,
      price: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 4,
  });

  const result = await Promise.all(
    topProducts.map(async (op) => {
      const variant = await prisma.variant.findUnique({
        where: { id: op.variant_id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: {
                where: { is_cover: true },
                select: { url: true },
                take: 1,
              },
            },
          },
        },
      });

      if (!variant) return null;

      return {
        productId: variant.product.id,
        name: variant.product.name,
        thumbnail: variant.product.images[0]?.url || null,
        totalQuantitySold: op._sum.quantity,
        totalRevenue: op._sum.price,
      };
    }),
  );

  return result.filter((r) => r !== null);
};

export const countOutOfStockProducts = (storeId: number) => {
  return prisma.product.count({
    where: {
      store_id: storeId,
      deleted_at: null,
      variants: {
        every: {
          stock: 0,
          deleted_at: null,
        },
      },
    },
  });
};

export const deleteProduct = async (productId: number) => {
  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const product = await tx.product.update({
      where: { id: productId },
      data: { deleted_at: now },
    });

    await tx.variant.updateMany({
      where: {
        product_id: productId,
        deleted_at: null,
      },
      data: { deleted_at: now },
    });

    return product;
  });
};

export const getProductCategoryAndSubcategory = async (productId: number) => {
  return prisma.product.findUnique({
    where: {
      id: productId,
      deleted_at: null,
    },
    select: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      subcategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateProduct = async (
  productId: number,
  data: {
    name: string;
    description: string;
    price: number;
    category_id: number;
    subcategory_id: number;
  },
) => {
  return prisma.product.update({
    where: { id: productId },
    data,
    include: {
      images: true,
      variants: true,
      subcategory: true, 
    },
  });
};

