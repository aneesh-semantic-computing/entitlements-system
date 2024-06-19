import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AccessRequest } from '../models/access-request.model';

@Injectable()
export class NotificationServiceClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'notification-service', port: 8878 },
    });
  }

  notifyOps(accessRequest: AccessRequest): Observable<void> {
    return this.client.send<void>({ cmd: 'notify-ops' }, accessRequest);
  }

  notifyQuant(accessRequest: AccessRequest): Observable<void> {
    console.log('notifyQuant client');
    return this.client.send<void>({ cmd: 'notify-quant' }, accessRequest);
  }
}
