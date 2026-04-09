const express = require("express");
const mongoose = require("mongoose");
const Payment = require("../model/Payment");
const router = express.Router();
const Cart = require("../model/Carts");
const ObjectId = mongoose.Types.ObjectId;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const validateRequest = require("../middleware/validateRequest");
const { paymentCreateSchema, emailQuerySchema, updateOrderStatusSchema } = require("../validators");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const verifyAdmin = require("../middleware/verifyAdmin");

// token
const verifyToken = require("../middleware/verifyToken");
const ALLOWED_TRANSITIONS = {
  "Order pending": ["Preparing", "Cancelled"],
  Preparing: ["On the way", "Cancelled"],
  "On the way": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

// post paymnet related info
router.post("/", verifyToken, validateRequest(paymentCreateSchema), async (req, res) => {
  try {
    const email = req.decoded.email;
    const { cartItems = [], transactionId } = req.body;

    if (!transactionId) {
      return sendError(res, 400, "transactionId is required");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return sendError(res, 400, "Invalid payment intent");
    }

    const cartIds = cartItems.map((id) => new ObjectId(id));
    const cartDocs = await Cart.find({ _id: { $in: cartIds }, email });
    if (cartDocs.length !== cartIds.length) {
      return sendError(res, 403, "Invalid cart ownership");
    }

    const totalPrice = cartDocs.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    const stripeAmount = paymentIntent.amount / 100;
    if (Math.abs(totalPrice - stripeAmount) > 0.01) {
      return sendError(res, 400, "Payment amount mismatch");
    }

    const paymentRequest = await Payment.create({
      transactionId,
      email,
      price: Number(totalPrice.toFixed(2)),
      quantity: cartDocs.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
      status: "Order pending",
      itemName: cartDocs.map((item) => item.name),
      cartItems: cartDocs.map((item) => item._id),
      menuItems: cartDocs.map((item) => item.menuItemId),
    });

    const deleteCartRequest = await Cart.deleteMany({ _id: { $in: cartIds }, email });
    return sendSuccess(
      res,
      200,
      { paymentRequest, deleteCartRequest },
      "Payment saved successfully"
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.get("/", verifyToken, validateRequest(emailQuerySchema), async (req, res) => {
  const email = req.query.email;
  try {
    const decodedEmail = req.decoded.email;
    if (email !== decodedEmail) {
      return sendError(res, 403, "Forbidden access");
    }
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const skip = (page - 1) * limit;
    const query = { email };
    const [result, total] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      Payment.countDocuments(query),
    ]);
    return sendSuccess(
      res,
      200,
      {
        items: result,
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
      "Payments fetched successfully"
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.get("/admin-orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const query = status ? { status } : {};

    const [items, total] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      Payment.countDocuments(query),
    ]);

    return sendSuccess(
      res,
      200,
      {
        items,
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
      "Admin orders fetched successfully"
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.patch(
  "/:id/status",
  verifyToken,
  verifyAdmin,
  validateRequest(updateOrderStatusSchema),
  async (req, res) => {
    try {
      const current = await Payment.findById(req.params.id);
      if (!current) {
        return sendError(res, 404, "Order not found");
      }
      const currentStatus = current.status;
      const nextStatus = req.body.status;
      const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
      if (!allowedNext.includes(nextStatus)) {
        return sendError(
          res,
          400,
          `Invalid status transition from "${currentStatus}" to "${nextStatus}"`
        );
      }
      current.status = nextStatus;
      const updated = await current.save();
      return sendSuccess(res, 200, updated, "Order status updated");
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }
);

module.exports = router;
