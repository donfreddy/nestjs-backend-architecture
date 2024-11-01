/*
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFile } from 'fs';
import * as path from 'path';
import { sign, verify } from 'jsonwebtoken';
import { promisify } from 'util';
import { JwtPayload } from './jwt-playload';
import { User } from '../../models/user/schemas/user.schema';
import { InternalError } from '../../common/helpers';

@Injectable()
export class JWTService {
  constructor() {}

  private readPublicKey(): Promise<string> {
    const filePath = path.join(__dirname, '../../../keys/public.pem');
    return promisify(readFile)(filePath, 'utf8');
  }

  private readPrivateKey(): Promise<string> {
    const filePath = path.join(__dirname, '../../../keys/private.pem');
    return promisify(readFile)(filePath, 'utf8');
  }

  /!**
   * This methode generate a token with the payload data
   *
   * @param payload The payload data
   * @returns
   *!/
  private async encode(payload: JwtPayload): Promise<string> {
    const cert = await this.readPrivateKey();
    if (!cert) {
      throw new HttpException('Token generate failure', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return promisify(sign)({ ...payload }, cert, { algorithm: 'RS256' });
  }

  /!**
   * This methode check the token and return the payload data when the token is valid
   *
   * @param token The token to check
   * @returns
   *!/
  public async validate(token: string): Promise<JwtPayload> {
    const cert = await this.readPublicKey();
    try {
      return (await promisify(verify)(token, cert)) as JwtPayload;
    } catch (e) {
      if (e && e.name === 'TokenExpiredError') {
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  /!**
   * Return the decoded payload if the token is valid and even if it's expired
   *
   * @param token The token to use for decoding the payload
   * @returns
   *!/
  public async decode(token: string): Promise<JwtPayload> {
    const cert = await this.readPublicKey();
    try {
      return (await promisify(verify)(token, cert, { ignoreExpiration: true })) as JwtPayload;
    } catch (e) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  /!**
   * Validate the token data
   *
   * @param payload The token data
   * @returns
   *!/
  public validateTokenData(payload: JwtPayload): boolean {
    const { sub, iss, aud, prm } = payload;
    const localIss = this.configService.get<string>('tokenInfo.issuer');
    const localAud = this.configService.get<string>('tokenInfo.audience');

    if (!sub || !iss || !aud || !prm || iss !== localIss || aud !== localAud) {
      console.log('Invalid token data');
      throw new HttpException('Invalid token data', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  /!**
   * Create the access token and the refresh token for the user
   *
   * @param user The user to create the token for
   * @param accessTokenKey The key to use for the access token
   * @param refreshTokenKey The key to use for the refresh token
   * @returns
   *!/
  public async createToken(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<Tokens> {
    /!*const tokenInfo = configService.getTokenInfo();
    const issuer = tokenInfo.issuer;
    const audience = tokenInfo.audience;
    const accessTokenValidity = tokenInfo.accessTokenValidity;
    const refreshTokenValidity = tokenInfo.refreshTokenValidity;*!/

    // Create the access token
    const accessToken = await this.encode(
      new JwtPayload(issuer, audience, user.email, accessTokenKey, accessTokenValidity),
    );

    // Create the refresh token
    const refreshToken = await this.encode(
      new JwtPayload(issuer, audience, user.email, refreshTokenKey, refreshTokenValidity),
    );

    // Check if the tokens have been created successfully.
    if (!accessToken || !refreshToken) throw new InternalError();

    // Return the tokens
    return { accessToken, refreshToken } as Tokens;
  }

  /!*private async generateToken(user: User): Promise<{ user: User; token: string }> {
  const payload: JwtPayload = { sub: user.id, email: user.email };
  const token = this.jwt.sign(payload);

  return { user, token };
}*!/
}
*/
