import { registerAs } from '@nestjs/config';

export default registerAs(
  'tokenInfo',
  (): Record<string, any> => ({
    accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
    refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
    issuer: process.env.TOKEN_ISSUER || '',
    audience: process.env.TOKEN_AUDIENCE || '',
  }),
);
