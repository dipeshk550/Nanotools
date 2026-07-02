const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/auth");
const User = require("../models/User");
const Tool = require("../models/Tool");
const ToolRun = require("../models/ToolRun");
const Payment = require("../models/Payment");
const { success } = require("../utils/response");

router.use(protect, requireAdmin);

router.get("/stats", async (req, res, next) => {
  try {
    const [users, proUsers, toolRuns, revenue] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ plan: { $ne: "free" } }),
      ToolRun.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      Payment.aggregate([{ $match: { status: "succeeded" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    success(res, { users, proUsers, toolRuns, revenue: revenue[0]?.total || 0 });
  } catch (err) { next(err); }
});

router.get("/users", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, plan, search } = req.query;
    const query = {};
    if (plan) query.plan = plan;
    if (search) query.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(query);
    success(res, { users, total });
  } catch (err) { next(err); }
});

router.get("/tools", async (req, res, next) => {
  try {
    const tools = await Tool.find().sort({ usageCount: -1 });
    success(res, { tools });
  } catch (err) { next(err); }
});

router.post("/tools", async (req, res, next) => {
  try {
    const tool = await Tool.create(req.body);
    success(res, { tool }, "Tool created", 201);
  } catch (err) { next(err); }
});

router.patch("/tools/:id", async (req, res, next) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
    success(res, { tool });
  } catch (err) { next(err); }
});

router.delete("/tools/:id", async (req, res, next) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    success(res, {}, "Tool deleted");
  } catch (err) { next(err); }
});

module.exports = router;
