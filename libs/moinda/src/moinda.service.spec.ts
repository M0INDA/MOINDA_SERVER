import { Test, TestingModule } from '@nestjs/testing';
import { MoindaService } from './moinda.service';

describe('MoindaService', () => {
  let service: MoindaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoindaService],
    }).compile();

    service = module.get<MoindaService>(MoindaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
