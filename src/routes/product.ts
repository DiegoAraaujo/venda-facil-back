import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductCategoryAndSubcategory,
  listProductsByStoreController,
  listStoreProductsForOwnerController,
  listTopSellingProductsController,
  updateProductController,
} from "../controllers/product";
import { upload } from "../middlewares/uploads3";
import auth from "../middlewares/auth";

const router = Router();

router.get("/", listProductsByStoreController);
router.get("/me", auth, listStoreProductsForOwnerController);

router.get("/top", auth, listTopSellingProductsController);
router.put("/:productId", auth, updateProductController);
router.get("/:productId/categories", auth, getProductCategoryAndSubcategory);
router.post("/", auth, upload.array("images", 6), createProductController);
router.delete("/:productId", auth, deleteProductController);

export default router;
