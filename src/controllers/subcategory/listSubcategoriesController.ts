import { Request, Response } from "express";
import { findSubcategoriesByCategoryId } from "../../repository/SubcategoryRepository";

const listSubcategoriesController = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);

  if (isNaN(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const subcategories = await findSubcategoriesByCategoryId(categoryId);
    return res.status(200).json(subcategories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error when searching subcategories" });
  }
};

export default listSubcategoriesController;
