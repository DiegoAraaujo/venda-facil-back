import { Request, Response } from "express";
import {
  updateSubcategory,
  getCategoryOfSubcategory,
  subcategoryNameExists,
} from "../../repository/SubcategoryRepository";

const updateSubcategoryController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);
  const subcategoryId = Number(req.params.subcategoryId);
  const { newName } = req.body;

  if (isNaN(subcategoryId)) {
    return res.status(400).json({ message: "Invalid subcategory ID" });
  }

  if (!newName || !newName.trim()) {
    return res.status(400).json({ message: "Invalid subcategory name" });
  }

  try {
    const subcategoryData = await getCategoryOfSubcategory(subcategoryId);

    if (!subcategoryData) {
      return res
        .status(404)
        .json({ message: "Subcategory not found or its category is deleted." });
    }

    const categoryId = subcategoryData.category_id;

    const alreadyExists = await subcategoryNameExists(
      storeId,
      categoryId,
      newName.trim(),
    );

    if (alreadyExists) {
      return res.status(409).json({
        message:
          "There is already a subcategory with that name in this category.",
      });
    }

    const updatedSubcategory = await updateSubcategory(
      subcategoryId,
      newName.trim(),
    );
    res.status(200).json(updatedSubcategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to update subcategory" });
  }
};

export default updateSubcategoryController;
