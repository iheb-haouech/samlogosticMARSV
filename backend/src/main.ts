import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import * as express from 'express';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
const fs = require('fs');

function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  // Reject weak/placeholder secrets in production.
  if (process.env.NODE_ENV === 'production') {
    const weak = /change[-_ ]?me|secret|refresh|placeholder|example/i;
    for (const key of ['JWT_SECRET', 'JWT_REFRESH_SECRET']) {
      const value = process.env[key] ?? '';
      if (value.length < 32 || weak.test(value)) {
        throw new Error(
          `${key} is too weak for production. Use a long random value (>= 32 chars).`,
        );
      }
    }
    if (process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different.');
    }
  }
}

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.create(AppModule, { cors: false });

  const isProduction = process.env.NODE_ENV === 'production';

  // Trust the reverse proxy (nginx) so client IP / protocol are correct
  // for rate limiting and secure cookies.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Limit request body size to mitigate abuse (file uploads use multer separately).
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'https://samlogistic.tn',
    'https://www.samlogistic.tn',
    'https://api.samlogistic.tn',
  ].filter(Boolean);
  // Drop local/dev origins once running in production.
  const corsOrigins = isProduction
    ? allowedOrigins.filter(
        (o) => !o.includes('localhost'),
      )
    : allowedOrigins;

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || corsOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // Rate limiting - 100 requests per minute per IP
  app.use(
    rateLimit({
      windowMs: 60000,
      max: 100,
      message: 'Too many requests, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Security headers middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.removeHeader('X-Powered-By');
    if (isProduction) {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload',
      );
    }
    next();
  });

  // Global request validation. Payload transformation is safe to enable
  // everywhere. NOTE: `whitelist`/`forbidNonWhitelisted` are intentionally
  // left off because most DTOs in this project have no class-validator
  // decorators yet; enabling them globally would strip valid request bodies.
  // Add decorators to the DTOs, then turn on `whitelist: true` for stricter
  // input validation.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Catch every unhandled exception and return a safe, structured error
  // instead of leaking stack traces or crashing the process.
  app.useGlobalFilters(new AllExceptionsFilter());

  // Keep the process alive on unexpected async errors with logging.
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled Rejection:', reason);
  });
  process.on('uncaughtException', (error: unknown) => {
    console.error('Uncaught Exception:', error);
  });

  // Expose Swagger only when explicitly enabled (disabled in production by default).
  const swaggerEnabled =
    process.env.SWAGGER_ENABLED === 'true' || !isProduction;
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('TUNLOG')
      .setDescription('Tunlog apis')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    fs.writeFileSync('./swagger.json', JSON.stringify(document));
  }

  await app.listen(Number(process.env.PORT) || 6001);
}
bootstrap();
