import { config } from 'dotenv';

config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = false): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`Config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getNodeEnv() {
    return this.getValue('NODE_ENV');
  }

  public getPort() {
    return parseInt(this.getValue('PORT') || '3000', 10);
  }

  public getTimeZone() {
    return this.getValue('TZ');
  }

  public getDB() {
    return {
      name: this.getValue('DB_NAME'),
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      user: this.getValue('DB_USER'),
      password: this.getValue('DB_USER_PWD'),
      minPoolSize: parseInt(this.getValue('DB_MIN_POOL_SIZE') || '5'),
      maxPoolSize: parseInt(this.getValue('DB_MAX_POOL_SIZE') || '10'),
    };
  }

  public getCorsUrl() {
    return {
      corsUrl: this.getValue('CORS_URL') || '*',
    };
  }

  public getTokenInfo() {
    return {
      accessTokenValidity: parseInt(this.getValue('ACCESS_TOKEN_VALIDITY_SEC') || '0'),
      refreshTokenValidity: parseInt(this.getValue('REFRESH_TOKEN_VALIDITY_SEC') || '0'),
      issuer: this.getValue('TOKEN_ISSUER') || '',
      audience: this.getValue('TOKEN_AUDIENCE') || '',
    };
  }

  public getLogDirectory() {
    return {
      logDirectory: this.getValue('LOG_DIR'),
    };
  }

  public getRedis() {
    return {
      host: this.getValue('REDIS_HOST'),
      port: parseInt(this.getValue('REDIS_PORT') || '0'),
      password: this.getValue('REDIS_PASSWORD') || '',
    };
  }

  public getCaching() {
    return {
      contentCacheDuration: parseInt(this.getValue('CONTENT_CACHE_DURATION_MILLIS') || '0'),
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DB_NAME',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
]);

export { configService };
