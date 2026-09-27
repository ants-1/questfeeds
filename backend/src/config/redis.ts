import { createClient } from "redis";

export const redis = createClient({
  url:
    process.env.NODE_ENV === "prod"
      ? process.env.REDIS_PROD_URL
      : process.env.REDIS_DEV_URL,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

export const connectRedis = async () => {
  try {
    await redis.connect();
  } catch (error) {
    console.error("Redis connection failed", error);
    process.exit(1);
  }
};
