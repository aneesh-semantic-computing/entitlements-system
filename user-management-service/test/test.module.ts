import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../src/user/user.module';
import { User } from '../src/user/user.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:',
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([User]),
    UserModule,
  ],
})
export class TestModule {}
