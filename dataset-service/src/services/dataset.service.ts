import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PricingDataset } from '../models/pricing-dataset.model';
import { UserManagementService } from './user-management.service';
import { QueryPricingDataDto } from '../dto/query-pricing-data.dto';
import { DatasetConfig } from 'src/models/dataset-config.model';

@Injectable()
export class DatasetService {
  constructor(
    @InjectModel(PricingDataset)
    private readonly pricingDatasetModel: typeof PricingDataset,
    @InjectModel(DatasetConfig)
    private readonly datasetConfigModel: typeof DatasetConfig,
    private readonly userManagementService: UserManagementService,
  ) {}

  async getPricingData(query: QueryPricingDataDto): Promise<PricingDataset[]> {
    const user = await this.userManagementService.getUserByApiKey(query.apiKey);

    if (!user) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (user.role === 'ops') {
      return this.pricingDatasetModel.findAll({
        where: { symbol: query.symbol, frequency: query.frequency },
      });
    }

    const userDatasetConfig = await this.userManagementService.getUserDatasetConfig(
      user.userId,
      query.symbol,
    );

    if (!userDatasetConfig || !userDatasetConfig[query.frequency]) {
      throw new UnauthorizedException('You do not have access to this data');
    }

    return this.pricingDatasetModel.findAll({
      where: { symbol: query.symbol, frequency: query.frequency },
    });
  }

  async findAll(): Promise<DatasetConfig[]> {
    return this.datasetConfigModel.findAll();
  }
}
