import { PrismaClient } from "@prisma/client";
import { Images } from "../types/product";

const prisma = new PrismaClient();

export const addImages = async (productId: number, images: Images[]) => {
  return Promise.all(
    images.map((image) =>
      prisma.image.create({
        data: {
          url: image.url,
          is_cover: image.is_cover,
          product_id: productId,
        },
      }),
    ),
  );
};
