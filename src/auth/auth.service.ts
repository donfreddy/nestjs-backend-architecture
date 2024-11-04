/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { UserService } from '../models/user/user.service';
import {
  comparePasswords,
  getTokenKey,
  hashPassword,
  RoleCode,
  validateTokenData,
} from '../common/helpers';
import * as _ from 'lodash';
import { User } from '../models/user/schemas/user.schema';
import { configService } from '../config/config.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './core/jwt-playload';
import * as path from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';
import { KeystoreService } from '../models/keystore/keystore.service';
import { Keystore } from '../models/keystore/schemas/keystore.schema';
import { Tokens } from '../types/app-request';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly keystoreService: KeystoreService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(inputs: LoginDto): Promise<{ user: Partial<User>; tokens: Tokens }> {
    const { email, password } = inputs;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException({ key: 'auth.error.user_not_registered' });
    if (!user.password) throw new BadRequestException({ key: 'auth.error.not_set_credentials' });

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      throw new NotFoundException({ key: 'auth.error.auth_failure' });
    }

    const accessTokenKey = getTokenKey();
    const refreshTokenKey = getTokenKey();

    await this.keystoreService.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await this.generateTokens(user, accessTokenKey, refreshTokenKey);
    const userData = await this.getUserData(user);

    return {
      user: userData,
      tokens: tokens,
    };
  }

  async signup(inputs: SignupDto): Promise<{ user: Partial<User>; tokens: Tokens }> {
    const user = await this.userService.findByEmail(inputs.email);
    if (user) throw new BadRequestException({ key: 'auth.error.user_already_registered' });

    const accessTokenKey = getTokenKey();
    const refreshTokenKey = getTokenKey();
    const passwordHash = await hashPassword(inputs.password);

    const { user: createdUser, keystore } = await this.userService.create(
      {
        name: inputs.name,
        email: inputs.email,
        profilePicUrl: inputs.profilePicUrl,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.LEARNER,
    );

    const tokens = await this.generateTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey,
    );
    const userData = await this.getUserData(createdUser);

    return {
      user: userData,
      tokens: tokens,
    };
  }

  async logout(keyStore: Keystore) {
    await this.keystoreService.remove(keyStore._id);
    return { logout: true };
  }

  async refresh(accessToken: string, refreshToken: string) {
    const filePath = path.join(__dirname, '../../keys/public.pem');
    const cert = await promisify(readFile)(filePath, 'utf8');
    if (!cert) {
      throw new InternalServerErrorException({ key: 'auth.error.token_verification_failure' });
    }

    const accessTokenPayload = this.jwtService.verify<JwtPayload>(accessToken, {
      publicKey: cert,
    });
    validateTokenData(accessTokenPayload);

    const { sub: accessTokenSub, prm: accessTokenPrm } = accessTokenPayload;

    const user = await this.userService.findById(new Types.ObjectId(accessTokenSub));
    if (!user) throw new NotFoundException({ key: 'auth.error.user_not_registered' });
    //req.user = user;

    const refreshTokenPayload = this.jwtService.verify<JwtPayload>(refreshToken, {
      publicKey: cert,
    });
    validateTokenData(accessTokenPayload);

    const { sub: refreshTokenSub, prm: refreshTokenPrm } = refreshTokenPayload;

    if (accessTokenSub !== refreshTokenSub) {
      throw new UnauthorizedException({ key: 'auth.error.invalid_access_token' });
    }

    const keystore = await this.keystoreService.find(user, accessTokenPrm, refreshTokenPrm);
    if (!keystore) throw new NotFoundException({ key: 'auth.error.invalid_token' });
    await this.keystoreService.remove(keystore._id);

    const accessTokenKey = getTokenKey();
    const refreshTokenKey = getTokenKey();

    await this.keystoreService.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await this.generateTokens(user, accessTokenKey, refreshTokenKey);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async generateTokens(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<Tokens> {
    const tokenInfo = configService.getTokenInfo();
    const issuer = tokenInfo.issuer;
    const audience = tokenInfo.audience;
    const accessTokenValidity = tokenInfo.accessTokenValidity;
    const refreshTokenValidity = tokenInfo.refreshTokenValidity;

    // Create the access token
    const accessToken = await this.generateToken(
      new JwtPayload(issuer, audience, user._id.toString(), accessTokenKey, accessTokenValidity),
    );

    // Create the refresh token
    const refreshToken = await this.generateToken(
      new JwtPayload(issuer, audience, user._id.toString(), refreshTokenKey, refreshTokenValidity),
    );

    // Check if the tokens have been created successfully.
    if (!accessToken || !refreshToken) {
      throw new InternalServerErrorException({ key: 'request.internal_server_error' });
    }

    // Return the tokens
    return { accessToken, refreshToken } as Tokens;
  }

  private async generateToken(payload: JwtPayload): Promise<string> {
    const filePath = path.join(__dirname, '../../keys/private.pem');
    const cert = await promisify(readFile)(filePath, 'utf8');
    if (!cert) {
      throw new InternalServerErrorException({ key: 'auth.error.token_generation_failure' });
    }

    return this.jwtService.signAsync(
      { ...payload },
      {
        privateKey: cert,
        algorithm: 'RS256',
      },
    );
  }

  async getUserData(user: User) {
    return _.pick(user, ['_id', 'name', 'roles', 'profilePicUrl']);
  }
}
