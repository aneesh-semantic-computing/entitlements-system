import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import { UserDataConfig } from './models/user-data-config.model';

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
        models: [User, UserDataConfig],
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User, UserDataConfig]),
  ],
})
class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const sequelize = app.get(Sequelize);

  await sequelize.sync({ force: true });

  await User.create({
    userId: 1,
    apiKey: 'user1_api_key',
    role: 'quant',
  } as User);

  await User.create({
    userId: 2,
    apiKey: 'user2_api_key',
    role: 'ops',
  } as User);

  console.log('Seeding completed!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
