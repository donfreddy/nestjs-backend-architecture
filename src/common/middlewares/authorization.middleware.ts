import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { ProtectedRequest } from '../../types/app-request';
import { RoleService } from '../../models/role/role.service';
import { Role } from '../../models/role/schemas/role.schema';

export class AuthorizationMiddleware implements NestMiddleware {
  constructor(private readonly roleService: RoleService) {}

  async use(req: ProtectedRequest, res: Response, next: NextFunction) {
    if (!req.user || !req.user.roles || !req.currentRoleCodes) {
      throw new UnauthorizedException({ key: 'auth.error.permission_denied' });
    }

    const roles = await this.roleService.findByCodes(req.currentRoleCodes);
    if (roles.length === 0)
      throw new UnauthorizedException({ key: 'auth.error.permission_denied' });

    let authorized = false;

    for (const userRole of req.user.roles as Role[]) {
      if (authorized) break;
      for (const role of roles) {
        // Replace role.code with the actual role id
        if (userRole._id.equals(role._id)) {
          authorized = true;
          break;
        }
      }
    }

    if (!authorized) throw new UnauthorizedException({ key: 'auth.error.permission_denied' });

    return next();
  }
}
