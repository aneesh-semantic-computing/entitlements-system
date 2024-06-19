import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from '../models/notification.model';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async notifyUser(request: any): Promise<void> {
    // Logic to notify the user
    console.log('Notifying user:', request);
  }
}
