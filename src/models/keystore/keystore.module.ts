import { Module } from '@nestjs/common';
import { KeystoreService } from './keystore.service';
import { KeystoreController } from './keystore.controller';

@Module({
  controllers: [KeystoreController],
  providers: [KeystoreService]
})
export class KeystoreModule {}
