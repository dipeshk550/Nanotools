const Redis = require("ioredis");
const logger = require("../utils/logger");

let client = null;

const connectRedis = () => {
  if (!process.env.REDIS_URL) {
    logger.warn("REDIS_URL not set — running without cache (this is fine for development)");
    return;
  }
  try {
    client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: () => null, // don't keep retrying forever
    });
    client.connect().catch(() => {
      logger.warn("Redis unavailable — running without cache");
      client = null;
    });
    client.on("connect", () => logger.info("Redis connected"));
    client.on("error", () => {}); // silenced after first warning above
  } catch (err) {
    logger.warn("Redis unavailable — running without cache");
  }
};

const getRedis = () => client;

module.exports = { connectRedis, getRedis };
