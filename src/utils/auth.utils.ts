import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Get token from headers and validate it
 *
 * @param authorization Authorization header
 * @returns
 */
export const getAccessToken = (authorization?: string) => {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HttpException('Invalid Authorization', HttpStatus.UNAUTHORIZED);
  }
  return authorization.split(' ')[1];
};
