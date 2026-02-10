import { Request, Response } from "express";
import { deleteCategoryById } from "../../repository/CategoryRepository";

export const deleteCategoryController = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);

  if (!categoryId || isNaN(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    await deleteCategoryById(categoryId);
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ message: "Failed to delete category" });
  }
};
export default deleteCategoryController;
