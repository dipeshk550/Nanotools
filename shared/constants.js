// Shared between client and server
module.exports = {
  PLANS: { FREE: "free", PRO: "pro", TEAM: "team" },
  ROLES: { USER: "user", ADMIN: "admin" },
  CATEGORIES: ["AI","PDF","Image","Video","Audio","SEO","Developer","Writing","Finance","Security","Business","Education","Social","QR","Utilities"],
  LIMITS: {
    FREE: { dailyRuns: 50, aiCredits: 5, uploadMB: 0 },
    PRO: { dailyRuns: Infinity, aiCredits: 500, uploadMB: 50 },
    TEAM: { dailyRuns: Infinity, aiCredits: 2000, uploadMB: 200 },
  },
  ERRORS: {
    UNAUTHORIZED: "Not authenticated",
    FORBIDDEN: "Access denied",
    NOT_FOUND: "Resource not found",
    RATE_LIMIT: "Too many requests",
    AI_CREDITS: "AI credits exhausted",
  },
};
