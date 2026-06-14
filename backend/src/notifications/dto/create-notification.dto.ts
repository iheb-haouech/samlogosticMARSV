export class CreateNotificationDto {
  userId?: number;
  roleId?: number;
  allUsers?: boolean;
  title: string;
  message: string;
  type?: string;
  orderId?: string;
}
