import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface QueueJob {
  id: string;
  type: string;
  data: unknown;
  createdAt: string;
  retries: number;
}

export type JobHandler = (data: unknown) => Promise<void>;

/**
 * QueueService provides lightweight background job processing using Redis lists.
 * Jobs are serialized as JSON and pushed/popped from Redis lists.
 *
 * Usage:
 *   - Producer: await queueService.dispatch('pdf-generation', { orderId: 123 })
 *   - Consumer: queueService.process('pdf-generation', handler)
 */
@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private handlers = new Map<string, JobHandler>();
  private workers = new Map<string, boolean>();
  private jobCounter = 0;

  constructor(private readonly redis: RedisService) {}

  async onModuleInit() {
    // Start polling for registered queues
    this.logger.log('📋 Queue service initialized');
  }

  /**
   * Dispatch a job to a named queue.
   */
  async dispatch(
    queue: string,
    data: unknown,
    options?: { delay?: number },
  ): Promise<string> {
    const job: QueueJob = {
      id: `job-${Date.now()}-${++this.jobCounter}`,
      type: queue,
      data,
      createdAt: new Date().toISOString(),
      retries: 0,
    };

    if (options?.delay) {
      // Simple delay: store with a timestamp and check before processing
      await this.redis.set(
        `queue:delayed:${job.id}`,
        JSON.stringify(job),
        options.delay,
      );
      await this.redis.pushJob(`delayed:${queue}`, job.id);
    } else {
      await this.redis.pushJob(queue, JSON.stringify(job));
    }

    this.logger.debug(`Job dispatched to [${queue}]: ${job.id}`);
    return job.id;
  }

  /**
   * Register a handler for a queue and start processing.
   */
  process(queue: string, handler: JobHandler): void {
    this.handlers.set(queue, handler);

    if (!this.workers.get(queue)) {
      this.workers.set(queue, true);
      this.startWorker(queue);
    }
  }

  private async startWorker(queue: string): Promise<void> {
    const handler = this.handlers.get(queue);
    if (!handler) return;

    this.logger.log(`🔄 Worker started for queue: [${queue}]`);

    while (this.workers.get(queue)) {
      try {
        const raw = await this.redis.popJob(queue, 2);
        if (!raw) continue;

        const job: QueueJob = JSON.parse(raw);
        this.logger.debug(`Processing job [${job.id}] from [${queue}]`);

        try {
          await handler(job.data);
          this.logger.debug(`Job [${job.id}] completed`);
        } catch (error) {
          this.logger.error(
            `Job [${job.id}] failed: ${error.message}`,
          );
          // Retry up to 3 times
          if (job.retries < 3) {
            job.retries++;
            await this.redis.pushJob(queue, JSON.stringify(job));
          }
        }
      } catch (error) {
        this.logger.error(`Worker error for [${queue}]: ${error.message}`);
        await this.sleep(1000);
      }
    }
  }

  /**
   * Get the number of pending jobs in a queue.
   */
  async getPendingCount(queue: string): Promise<number> {
    return this.redis.getQueueLength(queue);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
