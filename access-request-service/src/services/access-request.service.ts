import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessRequest } from '../models/access-request.model';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UserManagementServiceClient } from './user-management.service.client';
import { NotificationServiceClient } from './notification.service.client';
import { User } from '../interfaces/user.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccessRequestService {
  constructor(
    @InjectModel(AccessRequest)
    private readonly accessRequestModel: typeof AccessRequest,
    @Inject(UserManagementServiceClient)
    private readonly userManagementServiceClient: UserManagementServiceClient,
    @Inject(NotificationServiceClient)
    private readonly notificationServiceClient: NotificationServiceClient,
  ) {}

  async create(
    createAccessRequestDto: CreateAccessRequestDto,
    apiKey: string,
  ): Promise<AccessRequest> {
    const user: User | undefined = await lastValueFrom(
      this.userManagementServiceClient.getUserByApiKey(apiKey),
    );

    if (!user) {
      throw new Error('User not found');
    }

    const accessRequest = {
      userId: user.userId,
      symbol: createAccessRequestDto.symbol,
      hourly: createAccessRequestDto.hourly || false,
      daily: createAccessRequestDto.daily || false,
      monthly: createAccessRequestDto.monthly || false,
      status: 'Pending',
    } as AccessRequest

    await this.accessRequestModel.upsert(accessRequest);

    await this.notificationServiceClient.notifyOps(accessRequest);
    return accessRequest;
  }

  async approve(requestId: number, apiKey: string): Promise<AccessRequest> {
    const user: User | undefined = await lastValueFrom(
      this.userManagementServiceClient.getUserByApiKey(apiKey),
    );
    if (!user) {
      throw new Error('User not found');
    }

    const accessRequest = await this.accessRequestModel.findByPk(requestId);
    if (!accessRequest) {
      throw new Error('Access request not found');
    }

    if (accessRequest.status === "Approved") {
      throw new Error('The request is already approved.');
    }

    accessRequest.status = 'Approved';
    const savedAccessRequest = await accessRequest.save();
    await lastValueFrom(this.userManagementServiceClient.grantAccess(
      user.userId,
      accessRequest.symbol,
      savedAccessRequest,
    ));
    await this.notificationServiceClient.notifyQuant(accessRequest);

    return savedAccessRequest;
  }

  async reject(requestId: number, apiKey: string): Promise<AccessRequest> {
    const accessRequest = await this.accessRequestModel.findByPk(requestId);
    if (!accessRequest) {
      throw new Error('Access request not found');
    }
    if (accessRequest.status === "Rejected") {
      throw new Error('The request is already rejected.');
    }
    try {
      accessRequest.status = 'Rejected';
      await accessRequest.save();
      await this.notificationServiceClient.notifyQuant(accessRequest);
    } catch (error) {
      throw new Error('An unknown error occured while rejecting the request');
    }
    return accessRequest;
  }

  async findAll() {
    return this.accessRequestModel.findAll();
  }
}
