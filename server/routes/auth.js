const express = require("express");
const passport = require("passport");
const router = express.Router();
const auth = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const limiter = require("../middleware/rateLimiter");

router.post("/register", limiter.auth, auth.register);
router.post("/verify-otp", limiter.auth, auth.verifyOTP);
router.post("/login", limiter.auth, auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", protect, auth.logout);
router.post("/forgot-password", limiter.auth, auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);

const safeAuthenticate = (strategy, opts) => (req, res, next) => {
  if (!passport._strategy(strategy)) {
    return res.status(503).json({
      success: false,
      message: `${strategy} login is not configured on this server yet`,
    });
  }
  passport.authenticate(strategy, opts)(req, res, next);
};

router.get("/google", safeAuthenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", safeAuthenticate("google", { session: false }), auth.oauthSuccess);

router.get("/github", safeAuthenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", safeAuthenticate("github", { session: false }), auth.oauthSuccess);

module.exports = router;
