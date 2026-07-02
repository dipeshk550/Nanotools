const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stripePaymentIntentId: String,
    stripeSubscriptionId: String,
    amount: Number,
    currency: { type: String, default: "usd" },
    plan: String,
    status: { type: String, enum: ["pending","succeeded","failed","refunded"] },
    interval: { type: String, enum: ["month","year"] },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
