import { Request, Response } from "express";
import { findCategoryByStore } from "../../repository/CategoryRepository";

const listCategoriesByStoreController = async (req: Request, res: Response) => {
  const storeId = Number(req.params.storeId);

  if (isNaN(storeId)) {
    return res.status(400).json({ message: "Invalid storeId." });
  }

  try {
    const categories = await findCategoryByStore(storeId);
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Error when searching categories" });
  }
};

export default listCategoriesByStoreController;
