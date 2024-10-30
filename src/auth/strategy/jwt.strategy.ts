/*
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../core/jwt-playload';
// import { AuthConfigService } from 'src/config';
// import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authConfig: AuthConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.secret,
      ignoreExpiration: true,
    });
  }

  async validate(payload: JwtPayload): Promise<string> {
    const { email } = payload;
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new UnauthorizedException({ key: 'auth.ERROR.UNAUTHORIZED' });
    }
    return user;
  }
}
*/
