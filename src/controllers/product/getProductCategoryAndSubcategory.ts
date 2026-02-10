import { Request, Response } from "express";
import { getProductCategoryAndSubcategory as getProductCategoryAndSubcategoryRepo } from "../../repository/ProductRepository";

const getProductCategoryAndSubcategory = async (
  req: Request,
  res: Response,
) => {
  const productId = Number(req.params.productId);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  try {
    const result = await getProductCategoryAndSubcategoryRepo(productId);

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching product category and subcategory" });
  }
};

export default getProductCategoryAndSubcategory;
