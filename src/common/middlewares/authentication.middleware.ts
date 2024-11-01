import { NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { getAccessToken, validateTokenData } from '../helpers';
import { ProtectedRequest } from '../../types/app-request';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth/core/jwt-playload';
import { UserService } from '../../models/user/user.service';
import { KeystoreService } from '../../models/keystore/keystore.service';

export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly keystoreService: KeystoreService,
  ) {}

  async use(req: ProtectedRequest, res: Response, next: NextFunction) {
    // Get token
    req.accessToken = getAccessToken(req.headers.authorization);

    try {
      const payload = this.jwtService.verify<JwtPayload>(req.accessToken, {
        publicKey: '',
      });
      validateTokenData(payload);

      const user = await this.userService.findByEmail(payload.sub);
      if (!user) throw new NotFoundException({ key: 'auth.error.user_not_registered' });
      req.user = user;

      const keystore = await this.keystoreService.findFoyKey(req.user, payload.prm);
      if (!keystore) throw new NotFoundException({ key: 'auth.error.invalid_token' });
      req.keystore = keystore;

      return next();
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
