const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
require("dotenv").config();
const validateEnv = require("./api/config/validateEnv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const verifyToken = require("./api/middleware/verifyToken");
const verifyAdmin = require("./api/middleware/verifyAdmin");
const User = require("./api/model/User");
const Menu = require("./api/model/Menu");
const Payment = require("./api/model/Payment");
const Cart = require("./api/model/Carts");
const validateRequest = require("./api/middleware/validateRequest");
const { paymentIntentSchema } = require("./api/validators");
const { sendSuccess, sendError } = require("./api/utils/apiResponse");
const requestLogger = require("./api/middleware/requestLogger");
validateEnv();

// middlewares
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "https://food-app-client-jr6v.vercel.app"].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

// mongodb configurations
//

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xfnxnsj.mongodb.net/?appName=Cluster0`
  )
  .then(console.log("mongodb connected successfully"))
  .catch((error) => console.log("error connecting to mongodb", error));

// importing routes
const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoute");
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);

// stripe payment routes

app.post("/create-payment-intent", verifyToken, validateRequest(paymentIntentSchema), async (req, res) => {
  const { cartItems = [] } = req.body;

  try {
    const cartDocs = await Cart.find({
      _id: { $in: cartItems },
      email: req.decoded.email,
    });
    if (cartDocs.length !== cartItems.length) {
      return sendError(res, 403, "Invalid cart ownership");
    }
    const amount = Math.round(
      cartDocs.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ) * 100
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      payment_method_types: ["card"],
    });

    return sendSuccess(
      res,
      200,
      { clientSecret: paymentIntent.client_secret },
      "Payment intent created"
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World this is foodApp!");
});

app.get("/healthz", (req, res) => {
  return sendSuccess(res, 200, { status: "ok" }, "Service healthy");
});

app.get("/readyz", (req, res) => {
  const state = mongoose.connection.readyState;
  const isReady = state === 1;
  if (!isReady) {
    return sendError(res, 503, "Database not ready", { mongoReadyState: state });
  }
  return sendSuccess(res, 200, { status: "ready" }, "Service ready");
});

// admin stats 
app.get("/admin-stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const menuItems = await Menu.countDocuments();
    const orders = await Payment.countDocuments();

    // Calculate total revenue by summing the 'price' field in all payments
    const payments = await Payment.find();
    const revenue = payments.reduce((sum, payment) => sum + payment.price, 0);

    return sendSuccess(
      res,
      200,
      {
        users,
        menuItems,
        orders,
        revenue: parseFloat(revenue.toFixed(2)),
      },
      "Admin stats fetched"
    );
  } catch (error) {
    return sendError(res, 500, "Error fetching admin stats", error.message);
  }
});

/**
 * Order Stats (Optional but great for charts)
 * This groups payments by category to see what's selling most
 */
app.get("/order-stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $unwind: "$menuItems", // Breaks the array of IDs into individual rows
      },
      {
        $lookup: {
          from: "menus", // Joins with the Menu collection
          localField: "menuItems",
          foreignField: "_id",
          as: "menuItemDetails",
        },
      },
      {
        $unwind: "$menuItemDetails",
      },
      {
        $group: {
          _id: "$menuItemDetails.category",
          quantity: { $sum: 1 },
          revenue: { $sum: "$menuItemDetails.price" },
        },
      },
    ]);
    return sendSuccess(res, 200, result, "Order stats fetched");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

app.use((req, res) => {
  return sendError(res, 404, "Route not found");
});

app.use((err, req, res, next) => {
  return sendError(res, err.status || 500, err.message || "Internal server error");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
