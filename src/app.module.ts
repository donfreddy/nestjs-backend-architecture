import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApiKeyModule } from './models/apiKey/api-key.module';
import { KeystoreModule } from './models/keystore/keystore.module';
import { RoleModule } from './models/role/role.module';
import { BlogModule } from './models/blog/blog.module';
import { DatabaseModule } from './database/database.module';

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
  providers: [AppService],
})
export class AppModule {}
