import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DatasetService } from '../services/dataset.service';
import { QueryPricingDataDto } from '../dto/query-pricing-data.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { DatasetConfig } from '../models/dataset-config.model';

@Controller('datasets')
export class DatasetController {
  constructor(private readonly datasetService: DatasetService) {}

  @Get('pricing')
  @UseGuards(RolesGuard)
  @Roles('ops', 'quant')
  async getPricingData(@Query() query: QueryPricingDataDto) {
    return this.datasetService.getPricingData(query);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ops', 'quant')
  async getDatasetConfigs(): Promise<DatasetConfig[]> {
    return this.datasetService.findAll();
  }
}
