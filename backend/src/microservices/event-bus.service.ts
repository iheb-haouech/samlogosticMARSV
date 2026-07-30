import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

export type EventHandler = (data: unknown) => Promise<void>;

/**
 * EventBusService provides event-driven communication between modules
 * using Redis pub/sub. This decouples services and enables async processing.
 *
 * Events are namespaced with a dot separator:
 *   - order.created
 *   - order.statusChanged
 *   - user.registered
 *   - claim.created
 *   - notification.send
 *
 * Usage:
 *   // Publishing
 *   await eventBus.publish('order.created', { orderId: 123, userId: 456 });
 *
 *   // Subscribing (in onModuleInit)
 *   eventBus.subscribe('order.created', handler);
 */
@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private handlers = new Map<string, EventHandler[]>();

  constructor(private readonly redis: RedisService) {
    this.setupInternalSubscriptions();
  }

  /**
   * Publish an event with associated data.
   */
  async publish(event: string, data: unknown): Promise<void> {
    const payload = JSON.stringify({ event, data, timestamp: new Date().toISOString() });

    // Publish to Redis for external subscribers
    await this.redis.publish(`events:${event}`, payload);

    // Also publish to wildcard channel for monitoring
    await this.redis.publish('events:*', payload);

    // Handle local handlers synchronously
    await this.handleLocal(event, data);
  }

  /**
   * Subscribe to an event.
   */
  subscribe(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);

    // Also subscribe to Redis channel
    this.redis.subscribe(`events:${event}`, (message) => {
      try {
        const { data } = JSON.parse(message);
        handler(data);
      } catch (error) {
        this.logger.error(`Event handler error for ${event}: ${error.message}`);
      }
    });

    this.logger.debug(`Subscribed to event: ${event}`);
  }

  private async handleLocal(event: string, data: unknown): Promise<void> {
    const handlers = this.handlers.get(event) || [];
    for (const handler of handlers) {
      try {
        await handler(data);
      } catch (error) {
        this.logger.error(`Local handler error for ${event}: ${error.message}`);
      }
    }
  }

  private setupInternalSubscriptions(): void {
    // Log all events for monitoring (in non-production)
    if (process.env.NODE_ENV !== 'production') {
      this.redis.subscribe('events:*', (message) => {
        try {
          const { event, timestamp } = JSON.parse(message);
          this.logger.debug(`[Event] ${event} at ${timestamp}`);
        } catch {}
      });
    }
  }
}
