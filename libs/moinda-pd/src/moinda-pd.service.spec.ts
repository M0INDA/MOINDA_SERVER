import { Test, TestingModule } from '@nestjs/testing';
import { MoindaPdService } from './moinda-pd.service';

describe('MoindaPdService', () => {
  let service: MoindaPdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoindaPdService],
    }).compile();

    service = module.get<MoindaPdService>(MoindaPdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
