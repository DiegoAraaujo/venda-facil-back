import { Request, Response } from "express";
import { getWeeklyPurchases } from "../../repository/OrderProductRepository";
import { getWeeklyPurchasesCount } from "../../repository/PurchaseRepository";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";

const getWeeklyDashboardController = async (req: Request, res: Response) => {
  const storeId = Number(req.storeId);

  try {
    const [weeklyPurchasesItems, weeklyPurchases] = await Promise.all([
      getWeeklyPurchases(storeId),
      getWeeklyPurchasesCount(storeId),
    ]);

    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    const weeklyRevenueByDay = days.map((day) => {
      const dailyItems = weeklyPurchasesItems.filter(
        (item) =>
          item.purchase &&
          new Date(item.purchase.created_at).toDateString() ===
            day.toDateString(),
      );

      return dailyItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    });

    const weeklyOrdersByDay = days.map((day) => {
      const dailyOrders = weeklyPurchases.filter(
        (purchase) =>
          new Date(purchase.created_at).toDateString() === day.toDateString(),
      );
      return dailyOrders.length;
    });

    return res.json({
      weeklyRevenueByDay,
      weeklyOrdersByDay,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error retrieving data from the dashboard" });
  }
};

export default getWeeklyDashboardController;
