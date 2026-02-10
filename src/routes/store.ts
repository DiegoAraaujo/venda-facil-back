import { Router } from "express";
import {
  createStoreController,
  getStoreController,
  getStorePreviewController,
  getStoreStatsController,
  loginStoreController,
  refreshTokenController,
  registerVisitController,
} from "../controllers/store";
import { upload } from "../middlewares/uploads3";

const router = Router();

router.post(
  "/",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "profile_photo", maxCount: 1 },
  ]),
  createStoreController,
);

router.get("/:storeId", getStoreController);
router.get("/preview/:name", getStorePreviewController);
router.get("/:storeId/status", getStoreStatsController);

router.post("/login", loginStoreController);
router.post("/refresh", refreshTokenController);

router.post("/:storeId/visits", registerVisitController);

export default router;
