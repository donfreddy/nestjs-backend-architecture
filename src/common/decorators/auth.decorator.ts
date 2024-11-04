import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard, RoleGuard } from '../guards';

export const ROLE_CODES_KEY = 'roleCodes';

export function Auth(...roleCodes: string[]) {
  return applyDecorators(SetMetadata(ROLE_CODES_KEY, roleCodes), UseGuards(AuthGuard, RoleGuard));
}
