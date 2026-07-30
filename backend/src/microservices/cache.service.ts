import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * CacheService provides a high-level caching layer on top of Redis.
 * Uses JSON serialization and supports TTL, pattern invalidation,
 * and graceful degradation when Redis is unavailable.
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly DEFAULT_TTL = 300; // 5 minutes

  constructor(private readonly redis: RedisService) {}

  /**
   * Get a cached value by key. Returns null if not found or Redis is down.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get(`cache:${key}`);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Set a value in cache with optional TTL (in seconds).
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      await this.redis.set(
        `cache:${key}`,
        JSON.stringify(value),
        ttlSeconds || this.DEFAULT_TTL,
      );
    } catch (error) {
      this.logger.debug(`Cache set failed for ${key}: ${error.message}`);
    }
  }

  /**
   * Delete a specific cache key.
   */
  async del(key: string): Promise<void> {
    await this.redis.del(`cache:${key}`);
  }

  /**
   * Invalidate all cache keys matching a pattern.
   * Useful for clearing all order-related cache when an order changes.
   */
  async invalidatePattern(pattern: string): Promise<void> {
    await this.redis.delPattern(`cache:${pattern}`);
  }

  /**
   * Get-or-set: return cached value, or compute and cache the result.
   * Perfect for expensive database queries.
   */
  async getOrSet<T>(
    key: string,
    computeFn: () => Promise<T>,
    ttlSeconds?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await computeFn();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  /**
   * Clear cache for a specific entity type.
   * e.g., invalidateOrders() clears all keys matching "cache:orders:*"
   */
  async invalidateEntity(entity: string): Promise<void> {
    await this.redis.delPattern(`cache:${entity}:*`);
  }
}
