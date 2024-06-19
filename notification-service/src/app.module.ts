
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification.model';
import { NotificationController } from './controllers/notification.controller';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: false,
      synchronize: false,
    }),
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class AppModule {}
