import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DatasetConfig } from '../models/dataset-config.model';

@Injectable()
export class DatasetServiceClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.DATASET_SERVICE_HOST,
        port: Number(process.env.DATASET_SERVICE_PORT),
      },
    });
  }

  getDatasetConfigBySymbol(symbol: string): Observable<DatasetConfig> {
    return this.client.send<DatasetConfig>({ cmd: 'get-dataset-config-by-symbol' }, { symbol });
  }
}
