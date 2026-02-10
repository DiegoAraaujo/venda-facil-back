import { Request, Response } from "express";
import { getTopSellingProducts } from "../../repository/ProductRepository";

const listTopSellingProductsController = async (
  req: Request,
  res: Response,
) => {
  const storeId = Number(req.storeId);

  try {
    const topSellingProducts = await getTopSellingProducts(storeId);
    res.status(200).json(topSellingProducts);
  } catch (error) {
    res.status(500).json({ message: "internal error" });
  }
};

export default listTopSellingProductsController;
