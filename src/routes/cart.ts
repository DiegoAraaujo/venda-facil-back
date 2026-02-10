import { Router } from "express";
import { getCartItemsController } from "../controllers/product";

const router = Router();

router.post("/", getCartItemsController);

export default router;
