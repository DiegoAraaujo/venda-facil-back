import { Request, Response } from "express";
import { deleteSubcategory } from "../../repository/SubcategoryRepository";

const deleteSubcategoryController = async (req: Request, res: Response) => {
  const subcategoryId = Number(req.params.subcategoryId);

  if (isNaN(subcategoryId)) {
    return res.status(400).json({ message: "Invalid subcategory ID" });
  }

  try {
    await deleteSubcategory(subcategoryId);
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ message: "Failed to delete subcategory" });
  }
};

export default deleteSubcategoryController;
