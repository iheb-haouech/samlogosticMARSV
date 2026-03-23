import { Module } from '@nestjs/common';
import { UploadPodService } from './upload-pod.service';
import { UploadPodController } from './upload-pod.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UploadPodController],
  providers: [UploadPodService, PrismaService, JwtService],
})
export class UploadPodModule {}
