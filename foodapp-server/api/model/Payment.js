const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  transactionId: { type: String, required: true },
  email: { type: String, required: true, trim: true, index: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: "Order pending" },
  itemName: [{ type: String }],
  cartItems: [{ type: Schema.Types.ObjectId }],
  menuItems: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
