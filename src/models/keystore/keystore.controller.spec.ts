import { Test, TestingModule } from '@nestjs/testing';
import { KeystoreController } from './keystore.controller';
import { KeystoreService } from './keystore.service';

describe('KeystoreController', () => {
  let controller: KeystoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeystoreController],
      providers: [KeystoreService],
    }).compile();

    controller = module.get<KeystoreController>(KeystoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
