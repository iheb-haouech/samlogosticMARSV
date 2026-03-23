// backend/src/pdf-generator/pdf-generator.module.ts
import { Module } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PdfGeneratorService],
  exports: [PdfGeneratorService],
})
export class PdfGeneratorModule {}
