import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { AuthUserJWT } from '../utils/auth-user-jwt.decorator';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(@AuthUserJWT() userToken: string) {
    return this.notificationService.findAll(userToken);
  }

  @Post()
  create(@AuthUserJWT() userToken: string, @Body() dto: CreateNotificationDto) {
    return this.notificationService.create(userToken, dto);
  }

  @Post(':id/read')
  markAsRead(@AuthUserJWT() userToken: string, @Param('id') id: string) {
    return this.notificationService.markAsRead(userToken, +id);
  }

  @Get('unread-count')
  getUnreadCount(@AuthUserJWT() userToken: string) {
    return this.notificationService.getUnreadCount(userToken);
  }
}
