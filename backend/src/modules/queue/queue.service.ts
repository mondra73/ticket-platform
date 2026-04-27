import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type Redis from 'ioredis';

const QUEUE_KEY = 'ticket_queue';
const SESSION_PREFIX = 'queue_session:';
const ACTIVE_PREFIX = 'queue_active:';
const SESSION_TTL = 600;
const ACTIVE_TTL = 120; // 2 minutos para comprar

export interface QueueSession {
  userId: number;
  position: number;
  joinedAt: number;
}

@Injectable()
export class QueueService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async joinQueue(userId: number): Promise<{ position: number; estimatedWait: number }> {
    const sessionKey = `${SESSION_PREFIX}${userId}`;
    const existing = await this.redis.get(sessionKey);

    if (existing) {
      const position = await this.getPosition(userId);
      return { position, estimatedWait: position * 30 };
    }

    const now = Date.now();
    await this.redis.zadd(QUEUE_KEY, now, String(userId));
    await this.redis.setex(sessionKey, SESSION_TTL, JSON.stringify({ userId, joinedAt: now }));

    const position = await this.getPosition(userId);
    return { position, estimatedWait: position * 30 };
  }

  async getPosition(userId: number): Promise<number> {
    const rank = await this.redis.zrank(QUEUE_KEY, String(userId));
    return rank === null ? -1 : rank + 1;
  }

  async leaveQueue(userId: number): Promise<void> {
    await this.redis.zrem(QUEUE_KEY, String(userId));
    await this.redis.del(`${SESSION_PREFIX}${userId}`);
    await this.redis.del(`${ACTIVE_PREFIX}${userId}`);
  }

  async getQueueLength(): Promise<number> {
    return this.redis.zcard(QUEUE_KEY);
  }

  async isUserActive(userId: number): Promise<boolean> {
    const session = await this.redis.get(`${SESSION_PREFIX}${userId}`);
    return session !== null;
  }

  async simulateLoad(userCount: number): Promise<void> {
    const pipeline = this.redis.pipeline();
    const now = Date.now();
    for (let i = 1; i <= userCount; i++) {
      pipeline.zadd(QUEUE_KEY, now + i, String(100000 + i));
    }
    await pipeline.exec();
  }

  async clearQueue(): Promise<void> {
    await this.redis.del(QUEUE_KEY);
  }

  // Despacha al primer usuario de la cola
  async dispatchNext(): Promise<number | null> {
    const next = await this.redis.zrange(QUEUE_KEY, 0, 0);
    if (!next || next.length === 0) return null;

    const userId = Number(next[0]);

    // Marcarlo como activo con TTL de 2 minutos
    await this.redis.setex(
      `${ACTIVE_PREFIX}${userId}`,
      ACTIVE_TTL,
      JSON.stringify({ userId, dispatchedAt: Date.now() })
    );

    // Removerlo de la cola
    await this.redis.zrem(QUEUE_KEY, String(userId));
    await this.redis.del(`${SESSION_PREFIX}${userId}`);

    return userId;
  }

  async isUserDispatched(userId: number): Promise<boolean> {
    const active = await this.redis.get(`${ACTIVE_PREFIX}${userId}`);
    return active !== null;
  }

  async getActiveTTL(userId: number): Promise<number> {
    return this.redis.ttl(`${ACTIVE_PREFIX}${userId}`);
  }

  async clearActiveSession(userId: number): Promise<void> {
    await this.redis.del(`${ACTIVE_PREFIX}${userId}`);
  }
}