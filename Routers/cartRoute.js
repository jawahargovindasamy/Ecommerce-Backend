import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { addToCart, removeFromCart, updateCartQuantity, viewCart } from "../Controllers/cartController.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/view", authMiddleware, viewCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.put('/update/:productId', authMiddleware, updateCartQuantity);

export default router;
