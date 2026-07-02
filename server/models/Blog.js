const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [String],
    category: String,
    coverImage: String,
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
