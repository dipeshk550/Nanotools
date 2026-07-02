const express = require("express");
const router = express.Router();
const Tool = require("../models/Tool");
const ToolRun = require("../models/ToolRun");
const { protect, optionalAuth } = require("../middleware/auth");
const { success } = require("../utils/response");

router.get("/", async (req, res, next) => {
  try {
    const { category, search, featured, page = 1, limit = 50 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) query.$text = { $search: search };
    const tools = await Tool.find(query).sort({ usageCount: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Tool.countDocuments(query);
    success(res, { tools, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

router.get("/trending", async (req, res, next) => {
  try {
    const tools = await Tool.find({ isActive: true }).sort({ usageCount: -1 }).limit(10);
    success(res, { tools });
  } catch (err) { next(err); }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const tool = await Tool.findOne({ slug: req.params.slug, isActive: true });
    if (!tool) return res.status(404).json({ success: false, message: "Tool not found" });
    success(res, { tool });
  } catch (err) { next(err); }
});

router.post("/:id/run", optionalAuth, async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ success: false, message: "Tool not found" });
    await Tool.findByIdAndUpdate(req.params.id, { $inc: { usageCount: 1 } });
    if (req.user) {
      req.user.dailyRuns += 1;
      req.user.recentTools.unshift({ toolId: tool._id.toString(), usedAt: new Date() });
      if (req.user.recentTools.length > 20) req.user.recentTools.pop();
      await req.user.save();
    }
    await ToolRun.create({ userId: req.user?._id, toolId: tool._id, toolName: tool.name, category: tool.category, isAI: tool.isAI, ip: req.ip });
    success(res, { message: "Tool run recorded" });
  } catch (err) { next(err); }
});

module.exports = router;
