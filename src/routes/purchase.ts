import { Router } from "express";
import {
  createPurchaseController,
  deleteOrderItemController,
  getDashboardSummaryController,
  getMonthlyStatisticsController,
  getWeeklyDashboardController,
  listPurchasesController,
  listRecentOrdersController,
  updatePurchaseStatus,
} from "../controllers/purchase";
import auth from "../middlewares/auth";

const router = Router();

router.get("/dashboard/weekly", auth, getWeeklyDashboardController);
router.get("/stats/monthly", auth, getMonthlyStatisticsController);
router.get("/summary", auth, getDashboardSummaryController);

router.post("/:storeId", createPurchaseController);
router.get("/lastest", auth, listRecentOrdersController);
router.get("/:status", auth, listPurchasesController);
router.patch("/:purchaseId", auth, updatePurchaseStatus);
router.delete("/items/:orderItemId", auth, deleteOrderItemController);

export default router;
