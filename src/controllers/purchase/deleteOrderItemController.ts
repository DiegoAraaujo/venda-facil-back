import { Request, Response } from "express";
import {
  countOrderItemsByPurchase,
  deleteOrderProduct,
  getOrderItemById,
} from "../../repository/OrderProductRepository";
import { getPurchaseStatus } from "../../repository/PurchaseRepository";

const deleteOrderItemController = async (req: Request, res: Response) => {
  const orderItemId = Number(req.params.orderItemId);

  if (!orderItemId || isNaN(orderItemId)) {
    return res.status(400).json({ message: "Invalid order item ID." });
  }

  try {
    const orderItem = await getOrderItemById(orderItemId);

    if (!orderItem || orderItem.deleted_at) {
      return res.status(404).json({
        message: "Order item not found.",
      });
    }

    const purchaseStatus = await getPurchaseStatus(orderItem.purchase_id);

    if (!purchaseStatus) {
      return res.status(404).json({
        message: "Purchase not found.",
      });
    }

    if (purchaseStatus.status !== "PENDING") {
      return res.status(400).json({
        message: "You can only remove items from pending orders.",
      });
    }
    const itemsCount = await countOrderItemsByPurchase(orderItem.purchase_id);

    if (itemsCount <= 1) {
      return res.status(400).json({
        message: "You cannot remove the last item from an order.",
      });
    }

    await deleteOrderProduct(orderItemId);
    res.status(200).json({ success: true, orderItemId });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove order item.",
    });
  }
};

export default deleteOrderItemController;
