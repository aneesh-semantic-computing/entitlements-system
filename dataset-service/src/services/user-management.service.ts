import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserManagementService {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>('USER_MANAGEMENT_SERVICE_HOST'),
        port: this.configService.get<number>('USER_MANAGEMENT_SERVICE_PORT'),
      },
    });
  }

  getUserByApiKey(apiKey: string) {
    return this.client.send({ cmd: 'get_user_by_api_key' }, apiKey).toPromise();
  }

  getUserDatasetConfig(userId: number, symbol: string) {
    return this.client.send({ cmd: 'get_user_dataset_config' }, { userId, symbol }).toPromise();
  }
}
