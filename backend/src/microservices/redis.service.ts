import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

/**
 * RedisService wraps ioredis and provides a single Redis connection
 * shared across the application for caching, queues, and pub/sub.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    const options: RedisOptions = {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
      lazyConnect: true,
    };

    this.client = new Redis(redisUrl, options);
    this.subscriber = new Redis(redisUrl, options);
    this.publisher = new Redis(redisUrl, options);

    try {
      await Promise.all([
        this.client.connect(),
        this.subscriber.connect(),
        this.publisher.connect(),
      ]);
      this.logger.log('✅ Redis connected successfully');
    } catch (error) {
      this.logger.warn('⚠️ Redis not available - caching and queues disabled');
    }
  }

  onModuleDestroy() {
    this.client?.disconnect();
    this.subscriber?.disconnect();
    this.publisher?.disconnect();
  }

  /** Get the main Redis client */
  getClient(): Redis {
    return this.client;
  }

  /** Get the subscriber instance for pub/sub */
  getSubscriber(): Redis {
    return this.subscriber;
  }

  /** Get the publisher instance for pub/sub */
  getPublisher(): Redis {
    return this.publisher;
  }

  /** Check if Redis is connected */
  isConnected(): boolean {
    return this.client?.status === 'ready';
  }

  // ─── Convenience wrappers ───────────────────────────────────

  async get(key: string): Promise<string | null> {
    if (!this.isConnected()) return null;
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected()) return;
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected()) return;
    await this.client.del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.isConnected()) return;
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  /** Publish an event to a channel */
  async publish(channel: string, message: string): Promise<void> {
    if (!this.isConnected()) return;
    await this.publisher.publish(channel, message);
  }

  /** Subscribe to a channel */
  async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    if (!this.isConnected()) return;
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) callback(msg);
    });
  }

  /** Push a job to a list (simple queue) */
  async pushJob(queue: string, jobData: string): Promise<void> {
    if (!this.isConnected()) return;
    await this.client.lpush(`queue:${queue}`, jobData);
  }

  /** Pop a job from a list (blocking with timeout) */
  async popJob(queue: string, timeoutSeconds = 5): Promise<string | null> {
    if (!this.isConnected()) return null;
    const result = await this.client.brpop(`queue:${queue}`, timeoutSeconds);
    return result ? result[1] : null;
  }

  /** Get queue length */
  async getQueueLength(queue: string): Promise<number> {
    if (!this.isConnected()) return 0;
    return this.client.llen(`queue:${queue}`);
  }
}
