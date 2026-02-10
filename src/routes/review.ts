import { Router } from "express";
import {
  getReviewStatsController,
  createReviewController,
  listReviewsController,
  getLatest3ReviewsController,
} from "../controllers/review";
import { upload } from "../middlewares/uploads3";

const router = Router();

router.get("/:storeId/stats", getReviewStatsController);
router.get("/", listReviewsController);
router.get("/:storeId/latest", getLatest3ReviewsController);
router.post(
  "/:storeId",
  upload.single("profile_photo"),
  createReviewController,
);
export default router;
