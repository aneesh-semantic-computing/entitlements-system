import { Controller, Post, Body } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'notify-ops' })
  async notifyOps(@Payload() data: {  createNotificationDto: CreateNotificationDto }) {
    return this.notificationService.notifyUser(data.createNotificationDto);
  }

  @MessagePattern({ cmd: 'notify-quant' })
  async notifyQuant(@Payload() data: {  createNotificationDto: CreateNotificationDto}) {
    return this.notificationService.notifyUser(data.createNotificationDto);
  }
}
