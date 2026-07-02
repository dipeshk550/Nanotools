const mongoose = require("mongoose");

const toolRunSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toolId: String,
    toolName: String,
    category: String,
    isAI: Boolean,
    inputSize: Number,
    outputSize: Number,
    duration: Number,
    status: { type: String, enum: ["success","error"], default: "success" },
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

toolRunSchema.index({ createdAt: -1 });
toolRunSchema.index({ userId: 1, createdAt: -1 });
toolRunSchema.index({ toolId: 1, createdAt: -1 });

module.exports = mongoose.model("ToolRun", toolRunSchema);
