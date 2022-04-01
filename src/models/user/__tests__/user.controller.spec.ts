import { ProfileController } from './../profile.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';

describe('UserController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [UserService],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
