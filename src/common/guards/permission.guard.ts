import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PublicRequest } from '../../types/app-request';
import { PERMISSION_KEY } from '../decorators';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the required permission from the decorator's metadata
    const permission = this.reflector.get<string>(PERMISSION_KEY, context.getHandler());
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as PublicRequest;

    if (!request.apiKey?.permissions) {
      throw new ForbiddenException({ key: 'auth.error.permission_denied' });
    }

    const hasPermission = request.apiKey.permissions.includes(permission);
    if (!hasPermission) {
      throw new ForbiddenException({ key: 'auth.error.permission_denied' });
    }

    return true;
  }
}
