const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuControllers");

// Import your middlewares
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const validateRequest = require("../middleware/validateRequest");
const { menuItemSchema, idParamSchema } = require("../validators");

// --- PUBLIC ROUTES ---
// Anyone can view the menu or a single item
router.get("/", menuController.getAllMenuItems);
router.get("/:id", validateRequest(idParamSchema), menuController.singleMenuItem);

// --- ADMIN ONLY ROUTES ---
// We chain verifyToken first (to identify the user) 
// then verifyAdmin (to check their role)
router.post("/", verifyToken, verifyAdmin, validateRequest(menuItemSchema), menuController.postMenuItem);
router.delete("/:id", verifyToken, verifyAdmin, validateRequest(idParamSchema), menuController.deleteMenuItem);
router.patch("/:id", verifyToken, verifyAdmin, validateRequest(idParamSchema), menuController.updateMenuItem);

module.exports = router;