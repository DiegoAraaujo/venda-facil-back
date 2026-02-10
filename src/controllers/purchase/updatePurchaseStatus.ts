import { PurchaseStatus } from "@prisma/client";
import { Request, Response } from "express";
import {
  decrementVariantStock,
  getVariantIdsByPurchase,
  updatePurchaseStatus,
} from "../../repository/PurchaseRepository";
import { getVariants } from "../../repository/VariantRepository";

const updatePurchaseStatusController = async (req: Request, res: Response) => {
  const purchaseId = Number(req.params.purchaseId);
  const { status } = req.body;

  if (!purchaseId || isNaN(purchaseId)) {
    return res.status(400).json({ message: "Invalid purchase ID." });
  }

  if (!status || !(status in PurchaseStatus)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  try {
    const orderItems = await getVariantIdsByPurchase(purchaseId);
    const variantIds = orderItems.map((item) => item.variant_id);

    const variants = await getVariants(variantIds);

    const outOfStockItems: number[] = [];
    const unavailableItems: number[] = [];

    for (const item of orderItems) {
      const variant = variants.find((v) => v.id === item.variant_id);

      if (!variant) {
        unavailableItems.push(item.variant_id);
        continue;
      }

      if (variant.stock < item.quantity) {
        outOfStockItems.push(item.variant_id);
      }
    }

    if (
      status === "COMPLETED" &&
      (outOfStockItems.length > 0 || unavailableItems.length > 0)
    ) {
      return res.status(400).json({
        message: "Some items cannot be completed.",
        outOfStockItems,
        unavailableItems,
      });
    }

    const result = await updatePurchaseStatus(
      purchaseId,
      status as PurchaseStatus,
    );

    await Promise.all(
      result.items.map((item) =>
        decrementVariantStock(item.variant.id, item.quantity),
      ),
    );

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export default updatePurchaseStatusController;
