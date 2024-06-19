import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AccessRequestController } from './controllers/access-request.controller';
import { AccessRequestService } from './services/access-request.service';
import { NotificationServiceClient } from './services/notification.service.client';
import { UserManagementServiceClient } from './services/user-management.service.client';
import { AccessRequest } from './models/access-request.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([AccessRequest]),
      ClientsModule.register([
        {
          name: 'USER_MANAGEMENT_SERVICE',
          transport: Transport.TCP,
          options: {
            host: 'user-management-service', // Docker service name
            port: 3004,
          },
        },
      ])
  ],
  controllers: [AccessRequestController],
  providers: [AccessRequestService, NotificationServiceClient, UserManagementServiceClient],
})
export class AppModule {}
