import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserManagementServiceClient } from '../services/user-management.service.client';
import { User } from '../interfaces/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(UserManagementServiceClient)
    private readonly userManagementServiceClient: UserManagementServiceClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];

    if (!apiKey) {
      return false;
    }

    const user: User | undefined = await lastValueFrom(
      this.userManagementServiceClient.getUserByApiKey(apiKey),
    );
    
    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }
}
