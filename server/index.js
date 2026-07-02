require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

// Route imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const toolRoutes = require("./routes/tools");
const aiRoutes = require("./routes/ai");
const uploadRoutes = require("./routes/upload");
const paymentRoutes = require("./routes/payments");
const adminRoutes = require("./routes/admin");
const blogRoutes = require("./routes/blog");
const pdfRoutes = require("./routes/pdf");
const toolsApiRoutes = require("./routes/toolsApi");

require("./config/passport");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect databases
connectDB();
connectRedis();

// Trust proxy (for rate limiting behind Nginx/Render)
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Body parsing
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Logging
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Passport
app.use(passport.initialize());

// Global rate limiter
app.use("/api/", rateLimiter.global);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), version: "1.0.0" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/t", toolsApiRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`NanoTools API running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
