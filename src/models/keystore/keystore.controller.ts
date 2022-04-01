import { Controller } from '@nestjs/common';
import { KeystoreService } from './keystore.service';

@Controller('keystore')
export class KeystoreController {
  constructor(private readonly keystoreService: KeystoreService) {}
}
