const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { success, error } = require("../utils/response");

router.get("/me", protect, (req, res) => {
  success(res, { user: req.user });
});

router.patch("/me", protect, async (req, res, next) => {
  try {
    const allowed = ["name", "preferences"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    success(res, { user });
  } catch (err) { next(err); }
});

router.post("/bookmark/:toolId", protect, async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const user = req.user;
    const idx = user.bookmarks.indexOf(toolId);
    if (idx > -1) user.bookmarks.splice(idx, 1);
    else user.bookmarks.push(toolId);
    await user.save();
    success(res, { bookmarks: user.bookmarks, bookmarked: idx === -1 });
  } catch (err) { next(err); }
});

router.get("/me/history", protect, async (req, res, next) => {
  try {
    const ToolRun = require("../models/ToolRun");
    const history = await ToolRun.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    success(res, { history });
  } catch (err) { next(err); }
});

module.exports = router;
