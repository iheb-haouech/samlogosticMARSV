// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { PrismaService } from './prisma/prisma.service';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { PackagesModule } from './packages/packages.module';
import { TransportersModule } from './transporters/transporters.module';
import { GeneratePdfModule } from './generate-pdf/generate-pdf.module';
import { ClaimsModule } from './claims/claims.module';
import { AuthService } from './auth/auth.service';
import { UploadPodModule } from './upload-pod/upload-pod.module';
import { PdfGeneratorModule } from './pdf-generator/pdf-generator.module';
import { PdfDownloadModule } from './pdf-download/pdf-download.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
        template: {
          dir: `${__dirname}/../templates`,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ArticleModule,
    PrismaModule,
    MailModule,
    UserModule,
    AuthModule,
    OrdersModule,
    PackagesModule,
    TransportersModule,
    GeneratePdfModule,
    ClaimsModule,
    UploadPodModule,
    PdfGeneratorModule,
    PdfDownloadModule, // 👈 ICI au bon endroit
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule {}
