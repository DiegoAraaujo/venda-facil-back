import { Request, Response } from "express";
import { countOrders, countSales } from "../../repository/PurchaseRepository";
import {
  countOutOfStockProducts,
  countProducts,
} from "../../repository/ProductRepository";

const getDashboardSummaryController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);

  try {
    const [
      totalSalesCount,
      outOfStockProductsCount,
      totalProductsCount,
      pendingOrdersCount,
    ] = await Promise.all([
      countSales(storeId),
      countOutOfStockProducts(storeId),
      countProducts(storeId),
      countOrders(storeId, "PENDING"),
    ]);

    return res.status(200).json({
      totalSalesCount,
      outOfStockProductsCount,
      totalProductsCount,
      pendingOrdersCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load dashboard summary. Please try again later.",
    });
  }
};

export default getDashboardSummaryController;
