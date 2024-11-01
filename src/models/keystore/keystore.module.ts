import { Module } from '@nestjs/common';
import { KeystoreService } from './keystore.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Keystore, KeystoreSchema } from './schemas/keystore.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Keystore.name, schema: KeystoreSchema }])],
  providers: [KeystoreService],
  exports: [KeystoreService]
})
export class KeystoreModule {}
