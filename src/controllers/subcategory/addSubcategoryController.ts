import { Request, Response } from "express";
import {
  createSubcategory,
  subcategoryNameExists,
} from "../../repository/SubcategoryRepository";

const addSubcategoryController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);

  const categoryId = Number(req.params.categoryId);
  const { subcategories: subcategoriesInput } = req.body;

  if (isNaN(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  if (!Array.isArray(subcategoriesInput) || subcategoriesInput.length === 0) {
    return res
      .status(400)
      .json({ message: "subcategories must be a non-empty array" });
  }

  try {
    const createdSubcategories = [];
    const failedSubcategories = [];

    for (const subcategoryName of subcategoriesInput) {
      const name = subcategoryName.trim();

      if (!name) {
        failedSubcategories.push(subcategoryName);
        continue;
      }

      const exists = await subcategoryNameExists(storeId, categoryId, name);
      if (exists) {
        failedSubcategories.push(name);
        continue;
      }

      const createdSubcategory = await createSubcategory(categoryId, name);
      createdSubcategories.push({
        id: createdSubcategory.id,
        name: createdSubcategory.name,
      });
    }

    return res.status(201).json({
      created: createdSubcategories,
      failed: failedSubcategories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add subcategories" });
  }
};

export default addSubcategoryController;
