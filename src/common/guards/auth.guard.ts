import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProtectedRequest } from '../../types/app-request';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../models/user/user.service';
import { KeystoreService } from '../../models/keystore/keystore.service';
import { getAccessToken, validateTokenData } from '../helpers';
import * as path from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';
import { JwtPayload } from '../../auth/core/jwt-playload';
import { Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly keystoreService: KeystoreService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as ProtectedRequest;

    req.accessToken = getAccessToken(req.headers.authorization);

    try {
      const filePath = path.join(__dirname, '../../../keys/public.pem');
      const cert = await promisify(readFile)(filePath, 'utf8');
      if (!cert) {
        throw new InternalServerErrorException({ key: 'auth.error.token_verification_failure' });
      }

      const payload = this.jwtService.verify<JwtPayload>(req.accessToken, {
        publicKey: cert,
      });
      validateTokenData(payload);

      const { sub: id, prm: key } = payload;

      const user = await this.userService.findById(new Types.ObjectId(id));
      if (!user) throw new NotFoundException({ key: 'auth.error.user_not_registered' });
      req.user = user;

      const keystore = await this.keystoreService.findFoyKey(req.user, key);
      if (!keystore) throw new NotFoundException({ key: 'auth.error.invalid_token' });
      req.keystore = keystore;

      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException({ key: 'auth.error.token_expired' });
      }
      throw new UnauthorizedException(err.message);
    }
  }
}
