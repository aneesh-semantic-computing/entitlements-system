import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AccessRequest } from '../models/access-request.model';

@Injectable()
export class UserManagementServiceClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_MANAGEMENT_SERVICE_HOST,
        port: Number(process.env.USER_MANAGEMENT_SERVICE_PORT),
      },
    });
  }

  getUserByApiKey(apiKey: string): Observable<User> {
    return this.client.send<User>({ cmd: 'get-user-by-api-key' }, { apiKey });
  }

  grantAccess(
    userId: number,
    symbol: string,
    accessRequest: AccessRequest,
  ): Observable<void> {
    return this.client.send<void>(
      { cmd: 'grant-access' },
      {
        userId,
        symbol,
        hourly: accessRequest.hourly,
        daily: accessRequest.daily,
        monthly: accessRequest.monthly,
        periodFrom: null,
        periodTo: null,
      },
    );
  }
}
