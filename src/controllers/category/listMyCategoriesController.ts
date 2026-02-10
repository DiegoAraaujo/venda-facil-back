import { Request, Response } from "express";
import { findCategoryByStore } from "../../repository/CategoryRepository";

const listMyCategoriesController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);

  try {
    const categories = await findCategoryByStore(storeId);
    return res.status(200).json(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        subcategories: c.subcategories,
      })),
    );
  } catch (error) {
    return res.status(500).json({ message: "Error when searching categories" });
  }
};

export default listMyCategoriesController;
