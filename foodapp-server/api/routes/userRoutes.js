const express = require("express");
const router = express.Router();
const verifytoken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const validateRequest = require("../middleware/validateRequest");
const { createUserSchema, idParamSchema, emailParamSchema } = require("../validators");

const userController = require("../controllers/userController");
router.get("/", verifytoken, verifyAdmin, userController.getAllUsers);
router.post("/", validateRequest(createUserSchema), userController.createUser);
router.delete("/:id", verifytoken, verifyAdmin, validateRequest(idParamSchema), userController.deleteUser);
router.get("/admin/:email", verifytoken, validateRequest(emailParamSchema), userController.getAdmin);
router.patch("/admin/:id", verifytoken, verifyAdmin, validateRequest(idParamSchema), userController.makeAdmin);
router.post("/bootstrap-admin", verifytoken, userController.bootstrapAdmin);

module.exports = router;
