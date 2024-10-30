import { HttpException, HttpStatus, LogLevel } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { SALT_ROUNDS } from '../constants';

/**
 * Hash password
 *
 * @param password
 * @returns
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare passwords
 *
 * @param userPassword
 * @param currentPassword
 * @returns
 */
export const comparePasswords = async (
  userPassword: string,
  currentPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(userPassword, currentPassword);
};

/**
 * Generate hash that can be used as token
 *
 * @returns
 */
export const getHash = (): string => {
  return crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');
};

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

/**
 * Get log levels based on environment
 *
 * @param isProduction
 * @returns
 */
export const getLogLevels = (isProduction: boolean): LogLevel[] => {
  if (isProduction) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
};
