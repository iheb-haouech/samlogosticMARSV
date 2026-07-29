import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ContactController],
  providers: [PrismaService],
})
export class ContactModule {}