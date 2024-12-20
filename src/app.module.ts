import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import * as helmet from 'helmet';
import cors from 'cors';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApiKeyModule } from './models/apiKey/api-key.module';
import { KeystoreModule } from './models/keystore/keystore.module';
import { RoleModule } from './models/role/role.module';
import { BlogModule } from './models/blog/blog.module';
import { DatabaseModule } from './database/database.module';
import { ApikeyMiddleware, LogsMiddleware } from './common/middlewares';
import { configService } from './config/config.service';
import { PermissionGuard } from './common/guards';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { BlogCacheService } from './cache/blog-cache.service';

@Module({
  imports: [
    /**
     * External Modules
     */
    I18nModule.forRoot({
      fallbackLanguage: configService.getFallbackLanguage(),
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true, // Enable live translations
      },
      loader: I18nJsonLoader,
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const { host, port, password } = configService.getRedis();
        const store = await redisStore({
          url: `redis://:${password}@${host}:${port}`,
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 10 * 60000, // 10 minutes (milliseconds)
        };
      },
    }),

    /**
     * Internal Modules
     */
    AuthModule,
    UserModule,
    ApiKeyModule,
    KeystoreModule,
    RoleModule,
    BlogModule,
    DatabaseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    BlogCacheService,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware, cors, helmet(), ApikeyMiddleware).forRoutes('*');
  }
}
