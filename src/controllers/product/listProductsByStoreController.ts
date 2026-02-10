import { Request, Response } from "express";
import {
  countProducts,
  FindProductsByStore,
} from "../../repository/ProductRepository";

const listProductsByStoreController = async (req: Request, res: Response) => {
  const storeId = Number(req.query.storeId);

  if (isNaN(storeId)) {
    return res.status(400).json({ message: "Invalid storeId" });
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const perPage = Math.min(Number(req.query.perPage) || 10, 20);
  const category = req.query.category ? Number(req.query.category) : undefined;
  const subcategory = req.query.subcategory
    ? Number(req.query.subcategory)
    : undefined;

  const skip = (page - 1) * perPage;

  try {
    const [products, total] = await Promise.all([
      FindProductsByStore(storeId, skip, perPage, category, subcategory),
      countProducts(storeId, category, subcategory),
    ]);

    const totalPages = Math.ceil(total / perPage);

    const result = products.map((p) => {
      const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
      const { category_id, ...productWithoutCategory } = p;

      return { ...productWithoutCategory, inStock: totalStock > 0 };
    });
    return res.status(200).json({
      data: result,
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

export default listProductsByStoreController;
