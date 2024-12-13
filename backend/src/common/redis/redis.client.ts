import IORedis, { Redis, Cluster } from "ioredis";
import { redisConfig } from "./redis.config";

let redisClient: Redis | Cluster;

if (redisConfig.nodes.length > 1) {
  // 클러스터 모드
  redisClient = new IORedis.Cluster(redisConfig.nodes);
} else {
  // 단일 서버 모드
  const node = redisConfig.nodes[0];
  redisClient = new IORedis({
    host: node.host,
    port: node.port,
  });
}

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

(async () => {
  try {
    await redisClient.ping();
    console.log("Redis client connected");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

export default redisClient;
