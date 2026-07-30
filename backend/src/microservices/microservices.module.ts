import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheService } from './cache.service';
import { QueueService } from './queue.service';
import { EventBusService } from './event-bus.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * MicroservicesModule provides core infrastructure for event-driven
 * communication, caching, background queues, and health monitoring.
 *
 * This module is @Global() so all other modules can inject its services.
 */
@Global()
@Module({
  controllers: [HealthController],
  providers: [
    RedisService,
    CacheService,
    QueueService,
    EventBusService,
    HealthService,
  ],
  exports: [RedisService, CacheService, QueueService, EventBusService],
})
export class MicroservicesModule {}
