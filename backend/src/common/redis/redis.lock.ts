import { Redis, Cluster } from "ioredis";
import Redlock, { Lock } from "redlock";

type CompatibleRedisClient = (Redis | Cluster) & { [key: string]: any };

export class RedisLock {
  private redlock: Redlock;

  constructor(redisClients: CompatibleRedisClient[]) {
    this.redlock = new Redlock(redisClients as any, {
      retryCount: 3,
      retryDelay: 200,
      driftFactor: 0.01,
    });
  }

  async acquireLock(key: string, ttl: number): Promise<Lock | null> {
    try {
      return await this.redlock.acquire([key], ttl);
    } catch {
      return null;
    }
  }

  async releaseLock(lock: Lock): Promise<void> {
    try {
      await lock.release();
    } catch (error) {
      console.error("락 해제 실패:", error);
    }
  }
}

// Redis 클라이언트 배열 생성
import IORedis from "ioredis";

const redisClients: CompatibleRedisClient[] = [
  new IORedis("redis://localhost:6788") as CompatibleRedisClient,
];

(async () => {
  for (const client of redisClients) {
    await client.ping();
  }
})();
