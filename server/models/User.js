const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    avatar: { type: String, default: null },
    googleId: { type: String, sparse: true },
    githubId: { type: String, sparse: true },
    isVerified: { type: Boolean, default: false },
    otp: { code: String, expiresAt: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    plan: { type: String, enum: ["free", "pro", "team"], default: "free" },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    planExpiresAt: Date,
    aiCredits: { type: Number, default: 5 },
    aiCreditsResetAt: { type: Date, default: () => new Date() },
    dailyRuns: { type: Number, default: 0 },
    dailyRunsResetAt: { type: Date, default: () => new Date() },
    bookmarks: [{ type: String }],
    recentTools: [{ toolId: String, usedAt: Date }],
    preferences: {
      theme: { type: String, default: "light" },
      language: { type: String, default: "en" },
      newsletter: { type: Boolean, default: true },
    },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.canRun = function () {
  const now = new Date();
  const reset = new Date(this.dailyRunsResetAt);
  if (now.toDateString() !== reset.toDateString()) {
    this.dailyRuns = 0;
    this.dailyRunsResetAt = now;
  }
  if (this.plan === "free" && this.dailyRuns >= 50) return false;
  return true;
};

userSchema.methods.canUseAI = function () {
  const now = new Date();
  const reset = new Date(this.aiCreditsResetAt);
  if (now.toDateString() !== reset.toDateString()) {
    this.aiCredits = this.plan === "free" ? 5 : this.plan === "pro" ? 500 : 2000;
    this.aiCreditsResetAt = now;
  }
  return this.aiCredits > 0;
};

module.exports = mongoose.model("User", userSchema);
