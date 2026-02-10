import { Request, Response } from "express";
import { getMonthlyOrdersCount, getMonthlySalesCount } from "../../repository/PurchaseRepository";
import { getMonthlyRevenue } from "../../repository/OrderProductRepository";
import { countVisitsInMonth } from "../../repository/VisitsRepository";

const getMonthlyStatisticsController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);

  try {
    
    const [
      monthlyOrdersCount,
      monthlyRevenue,
      monthlySalesCount,
      monthlyVisitsCount,
    ] = await Promise.all([
      getMonthlyOrdersCount(storeId),
      getMonthlyRevenue(storeId),
      getMonthlySalesCount(storeId),
      countVisitsInMonth(storeId),
    ]);

    const totalRevenue = monthlyRevenue.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    return res.status(200).json({
      totalOrders: monthlyOrdersCount,
      completedOrders: monthlySalesCount,
      totalRevenue,
      monthlyVisitsCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving monthly statistics." });
  }
};

export default getMonthlyStatisticsController