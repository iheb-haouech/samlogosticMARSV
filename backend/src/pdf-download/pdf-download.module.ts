// backend/src/pdf-download/pdf-download.module.ts
import { Module } from '@nestjs/common';
import { PdfDownloadController } from './pdf-download.controller';

@Module({
  controllers: [PdfDownloadController],
})
export class PdfDownloadModule {}
