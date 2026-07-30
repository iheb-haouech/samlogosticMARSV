import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CacheService } from './cache.service';

export const CACHE_KEY = 'cache_key';
export const CACHE_TTL = 'cache_ttl';

/**
 * Decorator to cache an endpoint's response.
 *
 * Usage:
 *   @UseInterceptors(CacheInterceptor)
 *   @CacheKey('orders:list')
 *   @CacheTTL(60)
 *   @Get('orders')
 *   findAll() { ... }
 */
export const CacheKey = (key: string) =>
  (target: object, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(CACHE_KEY, key, descriptor?.value || target);
    return descriptor;
  };

export const CacheTTL = (seconds: number) =>
  (target: object, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(CACHE_TTL, seconds, descriptor?.value || target);
    return descriptor;
  };

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(
    private readonly cache: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY,
      context.getHandler(),
    );
    if (!cacheKey) return next.handle();

    const ttl = this.reflector.get<number>(
      CACHE_TTL,
      context.getHandler(),
    );

    // Build a unique key including query params
    const request = context.switchToHttp().getRequest();
    const queryStr = JSON.stringify(request.query || {});
    const fullKey = `${cacheKey}:${queryStr}`;

    try {
      const cached = await this.cache.get(fullKey);
      if (cached) {
        this.logger.debug(`Cache HIT: ${fullKey}`);
        return of(cached);
      }
    } catch {}

    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.cache.set(fullKey, data, ttl);
        } catch {}
      }),
    );
  }
}
