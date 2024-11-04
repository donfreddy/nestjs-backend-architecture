export const enum Header {
  API_KEY = 'x-api-key',
  AUTHORIZATION = 'authorization',
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

export enum Permission {
  GENERAL = 'GENERAL',
}
