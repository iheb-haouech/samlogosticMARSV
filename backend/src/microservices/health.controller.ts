import { Controller, Get, HttpCode } from '@nestjs/common';
import { HealthService } from './health.service';

/**
 * Health check endpoints for monitoring and Docker health checks.
 *
 * GET /health       → Full health report
 * GET /health/ready → Readiness probe (200 = ready, 503 = not ready)
 * GET /health/live  → Liveness probe (always 200 if app is running)
 */
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.check();
  }

  @Get('ready')
  @HttpCode(200)
  async getReadiness() {
    const health = await this.healthService.check();
    const statusCode = health.status === 'unhealthy' ? 503 : 200;
    return { statusCode, ...health };
  }

  @Get('live')
  @HttpCode(200)
  getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
