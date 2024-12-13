import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import Redlock, { Lock } from "redlock";
import redisClient from "./redis.client";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;
  private readonly subscriber: Redis;
  private readonly redlock: Redlock;

  constructor() {
    this.client = redisClient as Redis;
    this.subscriber = this.client.duplicate();

    // Redlock 인스턴스 초기화
    this.redlock = new Redlock([this.client], {
      retryCount: 3, // 재시도 횟수
      retryDelay: 200, // 재시도 간격 (ms)
      driftFactor: 0.01, // 시간 보정
    });
  }

  onModuleInit(): void {
    this.client.on("connect", () => console.log("Redis 연결 완료"));
    this.client.on("error", (err) => console.error("Redis 연결 오류:", err));

    this.subscriber.on("connect", () =>
      console.log("Redis 구독 클라이언트 연결 완료")
    );
    this.subscriber.on("error", (err) =>
      console.error("Redis 구독 클라이언트 오류:", err)
    );
  }

  onModuleDestroy(): void {
    this.client.quit();
    this.subscriber.quit();
    console.log("Redis 연결 종료");
  }

  // 기본 Redis 기능
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, "EX", ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Redis 락 기능 추가
  async acquireLock(key: string, ttl: number): Promise<Lock | null> {
    try {
      return await this.redlock.acquire([key], ttl);
    } catch (error) {
      console.error("Redis 락 획득 실패:", error);
      return null;
    }
  }

  async releaseLock(lock: Lock): Promise<void> {
    try {
      await lock.release();
    } catch (error) {
      console.error("Redis 락 해제 실패:", error);
    }
  }

  async getTTL(key: string): Promise<number> {
    const ttl = await this.client.ttl(key);
    return ttl; // Redis TTL 결과값 반환
  }
}
