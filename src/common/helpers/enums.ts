import { HttpStatus } from '@nestjs/common';

export const enum Env {
  DEV = 'dev',
  STG = 'stg',
  PRD = 'prd',
}

export const enum Header {
  API_KEY = 'x-api-key',
  AUTHORIZATION = 'authorization',
}

export const enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNSPECIFIED = 'Unspecified',
}

export enum RoleCode {
  LEARNER = 'LEARNER',
  WRITER = 'WRITER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

export const enum StatusCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
}

export enum ErrorType {
  BAD_TOKEN = 'BadTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  ACCESS_TOKEN = 'AccessTokenError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
  NO_ENTRY = 'NoEntryError',
  NO_DATA = 'NoDataError',
  BAD_REQUEST = 'BadRequestError',
  FORBIDDEN = 'ForbiddenError',
}