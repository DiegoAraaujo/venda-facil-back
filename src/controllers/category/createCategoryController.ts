import { Request, Response } from "express";
import {
  categoryNameExists,
  createCategory,
} from "../../repository/CategoryRepository";
import { createSubcategory } from "../../repository/SubcategoryRepository";

const createCategoryController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);
  const { name, subcategories } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Category name is required." });
  }

  try {
    const exists = await categoryNameExists(storeId, name.trim());
    if (exists) {
      return res
        .status(409)
        .json({ message: "A category with this name already exists." });
    }

    const category = await createCategory(storeId, name.trim());

    let createdSubcategories: { id: number; name: string }[] = [];

    if (Array.isArray(subcategories) && subcategories.length > 0) {
      createdSubcategories = await Promise.all(
        subcategories.map((sc: string) =>
          createSubcategory(category.id, sc.trim()),
        ),
      );
    }

    return res.status(201).json({
      id: category.id,
      name: category.name,
      subcategories: createdSubcategories.map((sc) => ({
        id: sc.id,
        name: sc.name,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category." });
  }
};

export default createCategoryController;
