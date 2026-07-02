const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { protect, requireAdmin } = require("../middleware/auth");
const { success } = require("../utils/response");

router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, tag } = req.query;
    const query = { published: true };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    const posts = await Blog.find(query).populate("author", "name avatar").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Blog.countDocuments(query);
    success(res, { posts, total });
  } catch (err) { next(err); }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const post = await Blog.findOneAndUpdate({ slug: req.params.slug, published: true }, { $inc: { views: 1 } }, { new: true }).populate("author", "name avatar");
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    success(res, { post });
  } catch (err) { next(err); }
});

router.post("/", protect, requireAdmin, async (req, res, next) => {
  try {
    const post = await Blog.create({ ...req.body, author: req.user._id });
    success(res, { post }, "Post created", 201);
  } catch (err) { next(err); }
});

module.exports = router;
