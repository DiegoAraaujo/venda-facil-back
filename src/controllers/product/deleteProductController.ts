import { Request, Response } from "express";
import { deleteProduct } from "../../repository/ProductRepository";

const deleteProductController = async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  try {
    await deleteProduct(productId);
    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteProductController;
