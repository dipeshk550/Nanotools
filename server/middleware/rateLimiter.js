const rateLimit = require("express-rate-limit");

exports.global = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.auth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts, try again in 15 minutes" },
});

exports.ai = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: "AI rate limit reached, slow down" },
});

exports.upload = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: "Upload rate limit reached" },
});
