const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const verifyToken = require("../middleware/verifyToken");
const validateRequest = require("../middleware/validateRequest");
const {
  createCartSchema,
  updateCartSchema,
  idParamSchema,
  emailQuerySchema,
} = require("../validators");

// All cart operations should require a logged-in user (verifyToken)

// 1. Get cart items for a specific user
router.get("/", verifyToken, validateRequest(emailQuerySchema), cartController.getCartByEmail);

// 2. Add an item to the cart
router.post("/", verifyToken, validateRequest(createCartSchema), cartController.addToCart);

// 3. Delete an item from the cart
router.delete("/:id", verifyToken, validateRequest(idParamSchema), cartController.deleteCart);

// 4. Update cart item quantity/info
router.put("/:id", verifyToken, validateRequest(updateCartSchema), cartController.updateCart);

// 5. Get a single cart item detail
// Fixed: Changed from .put to .get to avoid conflict with updateCart
router.get("/:id", verifyToken, validateRequest(idParamSchema), cartController.getSingleCart);

module.exports = router;