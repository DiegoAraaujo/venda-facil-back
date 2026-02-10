import { Request, Response } from "express";
import {
  countProducts,
  FindProductsByStore,
} from "../../repository/ProductRepository";

const listStoreProductsForOwnerController = async (
  req: Request,
  res: Response,
) => {
  const storeId = Number(req.storeId);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const perPage = Math.min(Number(req.query.perPage) || 10, 20);
  const category = req.query.category ? Number(req.query.category) : undefined;
  const productName =
    typeof req.query.productName === "string"
      ? req.query.productName
      : undefined;
  const skip = (page - 1) * perPage;

  try {
    const [products, total] = await Promise.all([
      FindProductsByStore(
        storeId,
        skip,
        perPage,
        category,
        undefined,
        productName,
      ),
      countProducts(storeId, category, undefined, productName),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return res.status(200).json({
      data: products.map((p) => {
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.variants.reduce((acc, v) => acc + v.stock, 0),
          image: p.images.filter((i) => i.is_cover)[0].url,
          categoryId: p.category_id,
          subcategoryId: p.subcategory?.id ?? null,
          variants: p.variants,
        };
      }),
      meta: {
        total,
        page,
        perPage,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default listStoreProductsForOwnerController;
