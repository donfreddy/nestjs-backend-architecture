import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../core/jwt-playload';
import { UserService } from '../../models/user/user.service';
import { User } from '../../models/user/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
      ignoreExpiration: true,
    });
  }

  async validate(payload: JwtPayload, done: (error: Error, user: User) => void) {
    const { sub: email } = payload;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      done(new UnauthorizedException('Invalid Access Token'), null);
    }
    return done(null, user);
  }
}
