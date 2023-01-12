import { Module } from '@nestjs/common';
import { MoindaService } from './moinda.service';

@Module({
  providers: [MoindaService],
  exports: [MoindaService],
})
export class MoindaModule {}
