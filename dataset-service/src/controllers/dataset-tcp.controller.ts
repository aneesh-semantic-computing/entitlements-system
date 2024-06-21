import { Controller } from '@nestjs/common';
import { DatasetService } from '../services/dataset.service';

import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DatasetTcpController {
  constructor(private readonly datasetService: DatasetService) {}

  @MessagePattern({ cmd: 'get-dataset-config-by-symbol' })
  async getDatasetConfigBySymbol(@Payload() data: { symbol: string }) {
    return this.datasetService.getDatasetConfigBySymbol(data.symbol);
  }
}
