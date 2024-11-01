/*
 * @issuer Software organization who issues the token.
 * @subject Intended user of the token.
 * @audience Basically identity of the intended recipient of the token.
 * @expiresIn Expiration time after which the token will be invalid.
 * @algorithm Encryption algorithm to be used to protect the token.
 */
export class JwtPayload {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  prm: string;

  constructor(issuer: string, audience: string, subject: string, param: string, validity: number) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity * 24 * 60 * 60;
    this.prm = param;
  }
}
