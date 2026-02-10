import { Request, Response } from "express";
import { updateProduct } from "../../repository/ProductRepository";
import { updateVariants } from "../../repository/VariantRepository";

const updateProductController = async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  const { name, description, price, category_id, subcategory_id, variants } =
    req.body;

  if (!Array.isArray(variants)) {
    return res.status(400).json({ message: "Variants are required" });
  }

  try {
    const product = await updateProduct(productId, {
      name,
      description,
      price,
      category_id,
      subcategory_id,
    });

    await updateVariants(
      variants.map((v: any) => ({
        id: v.id,
        stock: v.stock,
        deleted_at: v.deleted ? new Date() : null,
      })),
    );

    const totalStock = variants.reduce(
      (acc: number, v: any) => acc + v.stock,
      0,
    );

    return res.status(200).json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: totalStock,
      image: product.images.find((i) => i.is_cover)?.url ?? "",
      categoryId: product.category_id,
      subcategoryId: product.subcategory?.id ?? null,
      variants: variants,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating product" });
  }
};

export default updateProductController;
