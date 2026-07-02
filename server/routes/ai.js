const express = require("express");
const router = express.Router();
const ai = require("../controllers/aiController");
const { protect, optionalAuth } = require("../middleware/auth");
const limiter = require("../middleware/rateLimiter");

router.post("/run", limiter.ai, optionalAuth, ai.runAITool);
router.post("/stream", limiter.ai, optionalAuth, ai.streamAITool);
router.post("/recommend", limiter.ai, ai.recommend);

module.exports = router;
