import { Request, Response } from "express";
import { getCartVariants } from "../../repository/VariantRepository";

const getCartItemsController = async (req: Request, res: Response) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Carrinho vazio" });
  }

  try {
    const variantsId = items.map((i) => i.variantId);

    const variants = await getCartVariants(variantsId);

    const cartItems  = variants.map((v) => {
      const item = items.find((i) => i.variantId === v.id);

      return {
        variantId: v.id,
        color: v.color,
        size: v.size,
        inStock: v.stock,
        cartQuantity: item?.quantity || 0,
        available: !v.deleted_at && !v.product.deleted_at,
        product: {
          id: v.product.id,
          name: v.product.name,
          price: v.product.price,
          image: v.product.images[0]?.url || null,
        },
      };
    });
    return res.json(cartItems );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar itens do carrinho" });
  }
};

export default getCartItemsController;
