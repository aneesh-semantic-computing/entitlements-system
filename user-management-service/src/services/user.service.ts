import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserDataConfig } from '../models/user-data-config.model';
import { UpdateAccessDto } from '../dto/update-access.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(UserDataConfig) private userDataConfigModel: typeof UserDataConfig,
  ) {}

  async findByApiKey(apiKey: string): Promise<User | null> {
    return this.userModel.findOne({ where: { apiKey } });
  }

  async grantAccess(updateAccessDto: UpdateAccessDto): Promise<void> {
    const { userId, symbol, hourly, daily, monthly, periodFrom, periodTo } = updateAccessDto;
    await this.userDataConfigModel.upsert({
      userId,
      symbol,
      hourly,
      daily,
      monthly,
      periodFrom,
      periodTo,
    } as any);
  }
}
