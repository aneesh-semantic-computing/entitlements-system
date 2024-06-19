import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UpdateAccessDto } from '../dto/update-access.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get-user-by-api-key' })
  async getUserByApiKey(@Payload() data: { apiKey: string }) {
    console.log('service: ', data.apiKey);
    return this.userService.findByApiKey(data.apiKey);
  }

  @MessagePattern({ cmd: 'grant-access' })
  async grantAccess(@Payload() updateAccessDto: UpdateAccessDto) {
    await this.userService.grantAccess(updateAccessDto);
    return { success: true };
  }

  @MessagePattern({ cmd: 'get-user-dataset-config' })
  async getUserDatasetConfig(@Payload() data: { userId: number, symbol: string }) {
    return this.userService.getUserDatasetConfig(data.userId, data.symbol);
  }
}
