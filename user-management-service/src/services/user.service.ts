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
    
    // Check if the entry already exists
    const existingConfig = await this.userDataConfigModel.findOne({
      where: { userId, symbol }
    });

    if (existingConfig) {
      // Update only truthy values
      const updateFields: Partial<UserDataConfig> = {};
      if (hourly) updateFields.hourly = hourly;
      if (daily) updateFields.daily = daily;
      if (monthly) updateFields.monthly = monthly;
      if (periodFrom) updateFields.periodFrom = periodFrom;
      if (periodTo) updateFields.periodTo = periodTo;

      await this.userDataConfigModel.update(updateFields, { where: { userId, symbol } });
    } else {
      // Insert with both truthy and falsy values
      const newConfig = {
        userId,
        symbol,
        hourly,
        daily,
        monthly,
        periodFrom,
        periodTo
      };
      await this.userDataConfigModel.create(newConfig as any);
    }
  }

  async getUserDatasetConfig(userId: number, symbol: string): Promise<UserDataConfig | null> {
    return this.userDataConfigModel.findOne({
      where: {
        userId,
        symbol,
      },
    });
  }
}
