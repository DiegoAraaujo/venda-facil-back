import { Router } from "express";
import {
  addSubcategoryController,
  deleteSubcategoryController,
  listSubcategoriesController,
  updateSubcategoryController,
} from "../controllers/subcategory";
import {
  createCategoryController,
  deleteCategoryController,
  listCategoriesByStoreController,
  listMyCategoriesController,
  updateCategoryController,
} from "../controllers/category";
import auth from "../middlewares/auth";
const router = Router();

router.get("/me", auth, listMyCategoriesController);
router.get("/:storeId", listCategoriesByStoreController);
router.get("/sub/:categoryId", listSubcategoriesController);
router.delete("/sub/:subcategoryId", auth, deleteSubcategoryController);
router.patch("/:categoryId", auth, updateCategoryController);
router.patch("/sub/:subcategoryId", auth, updateSubcategoryController);

router.post("/", auth, createCategoryController);
router.post("/sub/:categoryId", auth, addSubcategoryController);
router.delete("/:categoryId", auth, deleteCategoryController);
export default router;
