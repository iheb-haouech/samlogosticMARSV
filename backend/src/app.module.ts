import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
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
import { CashflowModule } from './cashflow/cashflow.module';
import { NotificationModule } from './notifications/notification.module';
import { ContactModule } from './contact/contact.module';
import { QuotationsModule } from './quotations/quotations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ArticleModule,
    PrismaModule,
    UserModule,
    AuthModule,
    OrdersModule,
    PackagesModule,
    TransportersModule,
    GeneratePdfModule,
    ClaimsModule,
    UploadPodModule,
    PdfGeneratorModule,
    PdfDownloadModule,
    CashflowModule,
    NotificationModule,
    ContactModule,
    QuotationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule {}