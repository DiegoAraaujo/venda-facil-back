import { Request, Response } from "express";
import { getLatestPurchases } from "../../repository/PurchaseRepository";

const listRecentOrdersController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);

  try {
    const orders = await getLatestPurchases(storeId);

    const formatted = orders.map((order) => {
      const money = order.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      const quantity = order.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );

      const client = order.client.full_name;
      const status = order.status;

      return { money, client, quantity, status };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default listRecentOrdersController;
