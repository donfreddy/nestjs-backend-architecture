import { ApiKeyService } from './api-key.service';
import { Module } from '@nestjs/common';
import { ApiKey, ApiKeySchema } from './schemas/api-key.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }])],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
