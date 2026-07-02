const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["AI","PDF","Image","Video","Audio","SEO","Developer","Writing",
             "Finance","Security","Business","Education","Social","QR","Utilities"],
      required: true,
    },
    icon: { type: String, default: "ti-tool" },
    color: { type: String, default: "#7F77DD" },
    badge: { type: String, enum: ["ai","new","hot",null], default: null },
    isAI: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    aiPrompt: { type: String },
    tags: [String],
    relatedTools: [String],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

toolSchema.index({ name: "text", description: "text", tags: "text" });
toolSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Tool", toolSchema);
