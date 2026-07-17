import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

// Prisma error codes that indicate a transient connectivity problem
// (server unreachable, connection dropped after sleep/network hiccup).
const TRANSIENT_ERROR_CODES = new Set(['P1001', 'P1002', 'P1017']);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.connectWithRetry();

    // Automatically retry queries that fail because the database connection
    // was momentarily lost (e.g. the machine went to sleep). Without this,
    // a single dropped socket makes every request throw "Can't reach database
    // server" until the process is restarted.
    this.$use(async (params, next) => {
      const maxAttempts = 3;
      let lastError: unknown;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await next(params);
        } catch (error) {
          lastError = error;
          if (!this.isTransientError(error) || attempt === maxAttempts) {
            throw error;
          }
          this.logger.warn(
            `Transient DB error on ${params.model ?? '?'}.${params.action} ` +
              `(attempt ${attempt}/${maxAttempts}). Reconnecting...`,
          );
          await this.reconnect();
          await this.delay(attempt * 300);
        }
      }

      throw lastError;
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private isTransientError(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      TRANSIENT_ERROR_CODES.has(error.code)
    );
  }

  private async connectWithRetry(maxAttempts = 5): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        if (attempt > 1) {
          this.logger.log('Database connection established.');
        }
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          this.logger.error(
            `Could not connect to the database after ${maxAttempts} attempts.`,
          );
          throw error;
        }
        const wait = attempt * 1000;
        this.logger.warn(
          `Database not reachable (attempt ${attempt}/${maxAttempts}). ` +
            `Retrying in ${wait}ms...`,
        );
        await this.delay(wait);
      }
    }
  }

  private async reconnect(): Promise<void> {
    try {
      await this.$disconnect();
    } catch {
      // ignore disconnect errors; we are about to reconnect anyway
    }
    await this.connectWithRetry();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
