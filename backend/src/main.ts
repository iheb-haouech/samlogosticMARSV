import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import { AppModule } from './app.module';
const fs = require('fs');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const allowedOrigins = [
    `${process?.env?.FRONTEND_URL}`,
    'http://localhost:3000',
    'https://api.vanlog-express.com',
    '*',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TUNLOG')
    .setDescription('Tunlog apis')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await fs.writeFileSync('./swagger.json', JSON.stringify(document));

  await app.listen(6001);
}
bootstrap();
