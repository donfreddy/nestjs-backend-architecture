import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProtectedRequest } from '../../types/app-request';
import { RoleService } from '../../models/role/role.service';
import { Role } from '../../models/role/schemas/role.schema';
import { ROLE_CODES_KEY } from '../decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as ProtectedRequest;

    req.currentRoleCodes = this.reflector.get<string[]>(ROLE_CODES_KEY, context.getHandler());

    if (!req.user || !req.user.roles || !req.currentRoleCodes) {
      throw new UnauthorizedException({ key: 'auth.error.permission_denied' });
    }

    const roles = await this.roleService.findByCodes(req.currentRoleCodes);
    if (roles.length === 0) {
      throw new UnauthorizedException({ key: 'auth.error.permission_denied' });
    }

    let authorized = false;

    for (const userRole of req.user.roles as Role[]) {
      if (authorized) break;
      for (const role of roles) {
        if (userRole._id.equals(role._id)) {
          authorized = true;
          break;
        }
      }
    }

    if (!authorized) throw new UnauthorizedException({ key: 'auth.error.permission_denied' });

    return true;
  }
}
