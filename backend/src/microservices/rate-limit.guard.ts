import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Role-based rate limiting using Redis.
 * Different limits for different user roles.
 *
 * Usage:
 *   @UseGuards(RoleRateLimitGuard)
 *   @RoleRateLimit({ windowMs: 60000, max: 100 })
 *   @Get('orders')
 *   findAll() { ... }
 */

export interface RateLimitConfig {
  windowMs: number;   // Time window in milliseconds
  max: number;        // Max requests per window
}

const ROLE_LIMITS: Record<number, RateLimitConfig> = {
  1: { windowMs: 60000, max: 200 },  // ADMIN: 200/min
  4: { windowMs: 60000, max: 200 },  // SUPERADMIN: 200/min
  2: { windowMs: 60000, max: 120 },  // TRANSPORTER: 120/min
  3: { windowMs: 60000, max: 60 },   // CLIENT: 60/min
};

const DEFAULT_LIMIT: RateLimitConfig = { windowMs: 60000, max: 60 };

@Injectable()
export class RoleRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RoleRateLimitGuard.name);

  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.redis.isConnected()) return true; // Fail open

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';

    // Use user ID if authenticated, otherwise fall back to IP
    const identifier = user?.id ? `user:${user.id}` : `ip:${ip}`;
    const role = user?.role || 3; // Default to CLIENT
    const limit = ROLE_LIMITS[role] || DEFAULT_LIMIT;

    const windowSeconds = Math.ceil(limit.windowMs / 1000);
    const key = `ratelimit:${identifier}:${context.getHandler().name}`;

    try {
      const current = await this.redis.getClient().incr(key);
      if (current === 1) {
        await this.redis.getClient().expire(key, windowSeconds);
      }

      // Set rate limit headers
      const response = context.switchToHttp().getResponse();
      response.setHeader('X-RateLimit-Limit', limit.max);
      response.setHeader('X-RateLimit-Remaining', Math.max(0, limit.max - current));
      response.setHeader('X-RateLimit-Reset', windowSeconds);

      if (current > limit.max) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Trop de requêtes. Veuillez réessayer plus tard.',
            retryAfter: windowSeconds,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.warn(`Rate limit check failed: ${error.message}`);
      return true; // Fail open
    }
  }
}
