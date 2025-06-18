import express from "express";
import {
	getProducts,
	getProduct,
	getProductsByFeedbackCount,
	getProductsByCategory,
} from "../controllers/productController";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.get("/category/:category", getProductsByCategory);
router.post("/feedback", getProductsByFeedbackCount);

export default router;
