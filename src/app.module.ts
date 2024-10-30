import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApiKeyModule } from './models/apiKey/api-key.module';
import { KeystoreModule } from './models/keystore/keystore.module';
import { RoleModule } from './models/role/role.module';
import { BlogModule } from './models/blog/blog.module';
import { DatabaseModule } from './database/database.module';
import { LogsMiddleware } from './common/middlewares';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ApiKeyModule,
    KeystoreModule,
    RoleModule,
    BlogModule,
    DatabaseModule
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
