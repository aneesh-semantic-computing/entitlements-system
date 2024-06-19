import { Test, TestingModule } from '@nestjs/testing';
import { DatasetService } from './dataset.service';
import { getModelToken } from '@nestjs/sequelize';
import { PricingDataset } from '../models/pricing-dataset.model';
import { DatasetConfig } from '../models/dataset-config.model';
import { UserManagementService } from './user-management.service';
import { UnauthorizedException } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';

describe('DatasetService', () => {
  let service: DatasetService;
  let pricingDatasetModel: typeof PricingDataset;
  let datasetConfigModel: typeof DatasetConfig;
  let userManagementService: UserManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatasetService,
        {
          provide: getModelToken(PricingDataset),
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: getModelToken(DatasetConfig),
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: UserManagementService,
          useValue: {
            getUserByApiKey: jest.fn(),
            getUserDatasetConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DatasetService>(DatasetService);
    pricingDatasetModel = module.get<typeof PricingDataset>(getModelToken(PricingDataset));
    datasetConfigModel = module.get<typeof DatasetConfig>(getModelToken(DatasetConfig));
    userManagementService = module.get<UserManagementService>(UserManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPricingData', () => {
    it('should throw UnauthorizedException if the user is not found', async () => {
      jest.spyOn(userManagementService, 'getUserByApiKey').mockResolvedValue(null);

      await expect(service.getPricingData({ apiKey: 'invalid', symbol: 'BTC', frequency: 'daily' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return all pricing data if the user is an ops', async () => {
      const user = { userId: 1, role: 'ops' };
      const pricingData = [
        createMock<PricingDataset>({ symbol: 'BTC', frequency: 'daily', priceUsd: 40000 })
      ];
      jest.spyOn(userManagementService, 'getUserByApiKey').mockResolvedValue(user);
      jest.spyOn(pricingDatasetModel, 'findAll').mockResolvedValue(pricingData);

      const result = await service.getPricingData({ apiKey: 'valid', symbol: 'BTC', frequency: 'daily' });

      expect(result).toEqual(pricingData);
      expect(pricingDatasetModel.findAll).toHaveBeenCalledWith({
        where: { symbol: 'BTC', frequency: 'daily' },
      });
    });

    it('should throw UnauthorizedException if the quant does not have access', async () => {
      const user = { userId: 1, role: 'quant' };
      jest.spyOn(userManagementService, 'getUserByApiKey').mockResolvedValue(user);
      jest.spyOn(userManagementService, 'getUserDatasetConfig').mockResolvedValue(null);

      await expect(service.getPricingData({ apiKey: 'valid', symbol: 'BTC', frequency: 'daily' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return pricing data if the quant has access', async () => {
      const user = { userId: 1, role: 'quant' };
      const userDatasetConfig = { daily: true };
      const pricingData = [
        createMock<PricingDataset>({ symbol: 'BTC', frequency: 'daily', priceUsd: 40000 })
      ];
      jest.spyOn(userManagementService, 'getUserByApiKey').mockResolvedValue(user);
      jest.spyOn(userManagementService, 'getUserDatasetConfig').mockResolvedValue(userDatasetConfig);
      jest.spyOn(pricingDatasetModel, 'findAll').mockResolvedValue(pricingData);

      const result = await service.getPricingData({ apiKey: 'valid', symbol: 'BTC', frequency: 'daily' });

      expect(result).toEqual(pricingData);
      expect(pricingDatasetModel.findAll).toHaveBeenCalledWith({
        where: { symbol: 'BTC', frequency: 'daily' },
      });
    });
  });

  describe('findAll', () => {
    it('should return all dataset configs', async () => {
      const datasetConfigs = [
        createMock<DatasetConfig>({ symbol: 'BTC', name: 'Bitcoin', frequencies: ['hourly', 'daily'] })
      ];
      jest.spyOn(datasetConfigModel, 'findAll').mockResolvedValue(datasetConfigs);

      const result = await service.findAll();

      expect(result).toEqual(datasetConfigs);
      expect(datasetConfigModel.findAll).toHaveBeenCalled();
    });
  });
});
