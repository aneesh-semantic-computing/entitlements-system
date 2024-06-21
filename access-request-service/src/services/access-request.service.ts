import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessRequest } from '../models/access-request.model';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { UserManagementServiceClient } from './user-management.service.client';
import { NotificationServiceClient } from './notification.service.client';
import { User } from '../interfaces/user.interface';
import { lastValueFrom } from 'rxjs';
import { Op, WhereOptions } from 'sequelize';
import { DatasetServiceClient } from './dataset.service.client';
import { DatasetConfig } from '../interfaces/dataset-config.interface';

@Injectable()
export class AccessRequestService {
  constructor(
    @InjectModel(AccessRequest)
    private readonly accessRequestModel: typeof AccessRequest,
    @Inject(UserManagementServiceClient)
    private readonly userManagementServiceClient: UserManagementServiceClient,
    @Inject(DatasetServiceClient)
    private readonly datasetServiceClient: DatasetServiceClient,
    @Inject(NotificationServiceClient)
    private readonly notificationServiceClient: NotificationServiceClient,
  ) {}

  private parseBoolean(value: any): boolean {
    return value === 'true' || value === true;
  }

  async create(
    createAccessRequestDto: CreateAccessRequestDto,
    apiKey: string,
  ): Promise<AccessRequest> {
    const user: User | undefined = await lastValueFrom(
      this.userManagementServiceClient.getUserByApiKey(apiKey),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const datasetConfig: DatasetConfig | undefined =  await lastValueFrom(
      this.datasetServiceClient.getDatasetConfigBySymbol(createAccessRequestDto.symbol),
    );

    if (!datasetConfig) {
      throw new NotFoundException('Dataset config not found');
    }

    const requestedFrequencies = [
      { name: 'hourly', value: this.parseBoolean(createAccessRequestDto.hourly) },
      { name: 'daily', value: this.parseBoolean(createAccessRequestDto.daily) },
      { name: 'monthly', value: this.parseBoolean(createAccessRequestDto.monthly) },
    ];

    const invalidFrequencies = requestedFrequencies
      .filter(f => f.value && !datasetConfig.frequencies.includes(f.name))
      .map(f => f.name);

    if (invalidFrequencies.length > 0) {
      throw new BadRequestException(`Invalid frequencies requested: ${invalidFrequencies.join(', ')}`);
    }

    const activeRequests = await this.findAllByUser(user.userId, createAccessRequestDto.symbol, 'Pending');

    const accessRequest = {
      userId: user.userId,
      symbol: createAccessRequestDto.symbol,
      hourly: this.parseBoolean(createAccessRequestDto.hourly),
      daily: this.parseBoolean(createAccessRequestDto.daily),
      monthly: this.parseBoolean(createAccessRequestDto.monthly),
      status: 'Pending',
    } as AccessRequest;

    if (activeRequests && activeRequests.length > 0) {
      // Update the existing request
      await this.accessRequestModel.update(accessRequest, {
        where: {
          requestId: activeRequests[0].requestId
        }
      });
    } else {
      await this.accessRequestModel.create(accessRequest);
    }

    await this.notificationServiceClient.notifyOps(accessRequest);
    return accessRequest;
  }

  async approve(requestId: number, apiKey: string): Promise<AccessRequest> {
    const user: User | undefined = await lastValueFrom(
      this.userManagementServiceClient.getUserByApiKey(apiKey),
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accessRequest = await this.accessRequestModel.findByPk(requestId);
    if (!accessRequest) {
      throw new NotFoundException('Access request not found');
    }

    if (accessRequest.status !== "Pending") {
      throw new BadRequestException('The request is already actioned.');
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
      throw new NotFoundException('Access request not found');
    }
    if (accessRequest.status !== "Pending") {
      throw new BadRequestException('The request is already actioned.');
    }
    try {
      accessRequest.status = 'Rejected';
      await accessRequest.save();
      await this.notificationServiceClient.notifyQuant(accessRequest);
    } catch (error) {
      throw new InternalServerErrorException('An unknown error occured while rejecting the request');
    }
    return accessRequest;
  }

  async findAll() {
    return this.accessRequestModel.findAll();
  }

  async findByRequestId(requestId: number) {
    return this.accessRequestModel.findByPk(requestId);
  }

  async findAllByUser(userId: number, symbol = "", status: string = "") {
    const whereConditions: WhereOptions<AccessRequest> = { userId: userId };

    if (symbol) {
      whereConditions.symbol = symbol;
    }

    if (status) {
      whereConditions.status = status;
    }

    return this.accessRequestModel.findAll({
      where: whereConditions
    });
  }
}
