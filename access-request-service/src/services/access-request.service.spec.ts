import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestService } from './access-request.service';
import { getModelToken } from '@nestjs/sequelize';
import { AccessRequest } from '../models/access-request.model';
import { UserManagementServiceClient } from './user-management.service.client';
import { NotificationServiceClient } from './notification.service.client';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { of } from 'rxjs';

describe('AccessRequestService', () => {
  let service: AccessRequestService;
  let userManagementServiceClient: UserManagementServiceClient;
  let notificationServiceClient: NotificationServiceClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRequestService,
        {
          provide: getModelToken(AccessRequest),
          useValue: {
            upsert: jest.fn(),
            findByPk: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UserManagementServiceClient,
          useValue: {
            getUserByApiKey: jest.fn(),
            grantAccess: jest.fn(),
          },
        },
        {
          provide: NotificationServiceClient,
          useValue: {
            notifyOps: jest.fn().mockResolvedValue(undefined),
            notifyQuant: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AccessRequestService>(AccessRequestService);
    userManagementServiceClient = module.get<UserManagementServiceClient>(UserManagementServiceClient);
    notificationServiceClient = module.get<NotificationServiceClient>(NotificationServiceClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an access request', async () => {
    const createAccessRequestDto: CreateAccessRequestDto = {
      symbol: 'BTC',
      hourly: true,
      daily: false,
      monthly: false,
    };

    jest.spyOn(userManagementServiceClient, 'getUserByApiKey').mockReturnValue(
      of({
        userId: 1,
        apiKey: 'user1_api_key',
        role: 'quant',
      }),
    );

    const result = await service.create(createAccessRequestDto, 'user1_api_key');

    expect(result).toBeDefined();
    expect(notificationServiceClient.notifyOps).toHaveBeenCalled();
  });

  it('should approve an access request', async () => {
    const requestId = 1;

    jest.spyOn(userManagementServiceClient, 'getUserByApiKey').mockReturnValue(
      of({
        userId: 1,
        apiKey: 'user1_api_key',
        role: 'ops',
      }),
    );

    jest.spyOn(service['accessRequestModel'], 'findByPk').mockResolvedValue({
      userId: 1,
      symbol: 'BTC',
      hourly: true,
      daily: false,
      monthly: false,
      status: 'Pending',
      save: jest.fn().mockResolvedValue({
        userId: 1,
        symbol: 'BTC',
        hourly: true,
        daily: false,
        monthly: false,
        status: 'Approved',
      }),
    } as any);

    jest.spyOn(userManagementServiceClient, 'grantAccess').mockReturnValue(of(undefined));

    const result = await service.approve(requestId, 'user1_api_key');

    expect(result).toBeDefined();
    expect(result.status).toBe('Approved');
    expect(notificationServiceClient.notifyQuant).toHaveBeenCalled();
  });
});
