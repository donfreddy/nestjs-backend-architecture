/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { UserService } from '../models/user/user.service';
import { comparePasswords, getTokenKey, hashPassword, RoleCode } from '../common/helpers';
import * as _ from 'lodash';
import { User, UserDocument } from '../models/user/schemas/user.schema';
import { configService } from '../config/config.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './core/jwt-playload';
import * as path from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';
import { KeystoreService } from '../models/keystore/keystore.service';
import { Keystore } from '../models/keystore/schemas/keystore.schema';
import { Tokens } from '../types/app-request';

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
      throw new UnauthorizedException({ key: 'auth.error.auth_failure' });
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
    const keystore = await this.keystoreService.findFoyKey(keyStore.client, keyStore.primaryKey);
    if (keyStore) {
      await this.keystoreService.remove(keyStore['_id']);
    }
  }

  refresh() {
    throw new Error('Method not implemented.');
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
    if (!accessToken || !refreshToken) throw new InternalServerErrorException();

    // Return the tokens
    return { accessToken, refreshToken } as Tokens;
  }

  private async generateToken(payload: JwtPayload): Promise<string> {
    const filePath = path.join(__dirname, '../../keys/private.pem');
    const cert = await promisify(readFile)(filePath, 'utf8');
    // if (!cert) throw new InternalError('Token generation failure');
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
