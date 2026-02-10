import { Request, Response } from "express";
import { CheckoutSchema } from "../../utils/validation";
import { createClient } from "../../repository/ClientRepository";
import { getCartVariants } from "../../repository/VariantRepository";
import { createPurchase } from "../../repository/PurchaseRepository";

const createPurchaseController = async (req: Request, res: Response) => {
  const storeId = Number(req.params.storeId);
  const { value, error } = CheckoutSchema.validate(req.body);

  if (!storeId || isNaN(storeId)) {
    return res.status(400).json({ message: "invalid store id" });
  }

  if (error) {
    return res
      .status(400)
      .json({ message: "validation_failed", details: error.details });
  }

  try {
    const client = await createClient(
      value.full_name,
      value.address,
      value.whatsApp,
    );

    const variantIds = value.items.map(
      (item: { variantId: number; quantity: number }) => item.variantId,
    );
    const variants = await getCartVariants(variantIds);

    const errors: {
      variantId: number;
      field: "unavailable" | "insufficient_stock";
    }[] = [];
    const validItems = [];

    for (const item of value.items) {
      const variant = variants.find(
        (v) => v.id === item.variantId && !v.deleted_at,
      );

      if (!variant) {
        errors.push({ variantId: item.variantId, field: "unavailable" });
        continue;
      }

      if (variant.stock < item.quantity) {
        errors.push({ variantId: item.variantId, field: "insufficient_stock" });
        continue;
      }

      validItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        price: variant.product.price,
        color: variant.color,
        size: variant.size,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const purchase = await createPurchase(storeId, client.id, validItems);

    return res.status(201).json(purchase);
  } catch (err) {
    return res.status(500).json({ message: "failed to create order" });
  }
};

export default createPurchaseController;
