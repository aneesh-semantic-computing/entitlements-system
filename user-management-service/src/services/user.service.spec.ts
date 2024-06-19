import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserDataConfig } from '../models/user-data-config.model';
import { UpdateAccessDto } from '../dto/update-access.dto';
import { createMock } from '@golevelup/nestjs-testing';

describe('UserService', () => {
  let service: UserService;
  let userModel: typeof User;
  let userDataConfigModel: typeof UserDataConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(UserDataConfig),
          useValue: {
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<typeof User>(getModelToken(User));
    userDataConfigModel = module.get<typeof UserDataConfig>(getModelToken(UserDataConfig));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByApiKey', () => {
    it('should return a user if found', async () => {
      const user = createMock<User>({ apiKey: 'valid_api_key' });
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);

      const result = await service.findByApiKey('valid_api_key');
      expect(result).toEqual(user);
      expect(userModel.findOne).toHaveBeenCalledWith({ where: { apiKey: 'valid_api_key' } });
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      const result = await service.findByApiKey('invalid_api_key');
      expect(result).toBeNull();
      expect(userModel.findOne).toHaveBeenCalledWith({ where: { apiKey: 'invalid_api_key' } });
    });
  });

  describe('grantAccess', () => {
    it('should upsert user data config', async () => {
      const updateAccessDto: UpdateAccessDto = {
        userId: 1,
        symbol: 'BTC',
        hourly: true,
        daily: true,
        monthly: false,
        periodFrom: new Date('2023-01-01T00:00:00.000Z'), // Providing valid dates instead of null
        periodTo: new Date('2023-12-31T23:59:59.999Z'),   // Providing valid dates instead of null
      };
      jest.spyOn(userDataConfigModel, 'upsert').mockResolvedValue([{} as any, false]);

      await service.grantAccess(updateAccessDto);

      expect(userDataConfigModel.upsert).toHaveBeenCalledWith({
        userId: 1,
        symbol: 'BTC',
        hourly: true,
        daily: true,
        monthly: false,
        periodFrom: new Date('2023-01-01T00:00:00.000Z'), // Providing valid dates instead of null
        periodTo: new Date('2023-12-31T23:59:59.999Z'),   // Providing valid dates instead of null
      });
    });
  });
});
