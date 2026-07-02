const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Payment = require("../models/Payment");
const { success, error } = require("../utils/response");

router.post("/create-checkout", protect, async (req, res, next) => {
  try {
    const { plan, interval } = req.body;
    const priceId = plan === "pro" ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_TEAM_PRICE_ID;

    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: req.user.email, name: req.user.name });
      customerId = customer.id;
      req.user.stripeCustomerId = customerId;
      await req.user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      metadata: { userId: req.user._id.toString(), plan },
    });

    success(res, { url: session.url });
  } catch (err) { next(err); }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: "Webhook error" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, plan } = session.metadata;
    await User.findByIdAndUpdate(userId, {
      plan,
      stripeSubscriptionId: session.subscription,
      aiCredits: plan === "pro" ? 500 : 2000,
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await Payment.create({ userId, stripePaymentIntentId: session.payment_intent, amount: session.amount_total, plan, status: "succeeded" });
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    await User.findOneAndUpdate({ stripeSubscriptionId: sub.id }, { plan: "free", aiCredits: 5 });
  }

  res.json({ received: true });
});

router.get("/portal", protect, async (req, res, next) => {
  try {
    if (!req.user.stripeCustomerId) return error(res, "No billing account found");
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
    });
    success(res, { url: session.url });
  } catch (err) { next(err); }
});

module.exports = router;
