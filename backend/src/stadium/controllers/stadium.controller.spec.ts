import { Test, TestingModule } from '@nestjs/testing';
import { StadiumController } from './stadium.controller';

describe('StadiumController', () => {
  let controller: StadiumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StadiumController],
    }).compile();

    controller = module.get<StadiumController>(StadiumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
