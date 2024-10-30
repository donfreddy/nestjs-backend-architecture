import { Module } from '@nestjs/common';
import { KeystoreService } from './keystore.service';
import { KeystoreController } from './keystore.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Keystore, KeystoreSchema } from './schemas/keystore.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Keystore.name, schema: KeystoreSchema }])],
  controllers: [KeystoreController],
  providers: [KeystoreService]
})
export class KeystoreModule {}
