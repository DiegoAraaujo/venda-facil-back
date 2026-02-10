import { Request, Response } from "express";
import {
  categoryNameExists,
  updateCategory,
} from "../../repository/CategoryRepository";

export const updateCategoryController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);

  const categoryId = Number(req.params.categoryId);
  const { newName } = req.body;

  if (!categoryId || isNaN(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  if (!newName || !newName.trim()) {
    return res.status(400).json({ message: "Invalid category name" });
  }

  try {
    const alreadyExists = await categoryNameExists(storeId, newName.trim());

    if (alreadyExists) {
      return res.status(409).json({
        message: "There is already a category with that name.",
      });
    }
    const category = await updateCategory(categoryId, newName.trim());
    return res.status(200).json({ id: category.id, name: category.name });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update category" });
  }
};

export default updateCategoryController;
