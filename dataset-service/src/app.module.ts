import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatasetController } from './controllers/dataset.controller';
import { DatasetService } from './services/dataset.service';
import { PricingDataset } from './models/pricing-dataset.model';
import { DatasetConfig } from './models/dataset-config.model';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserManagementServiceClient } from './services/user-management.service.client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
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
    SequelizeModule.forFeature([PricingDataset, DatasetConfig]),
      ClientsModule.register([
        {
          name: 'USER_MANAGEMENT_SERVICE',
          transport: Transport.TCP,
          options: {
            host: 'user-management-service', // Docker service name
            port: 3004,
          },
        },
      ]),
  ],
  controllers: [DatasetController],
  providers: [DatasetService, UserManagementServiceClient],
})
export class AppModule {}
