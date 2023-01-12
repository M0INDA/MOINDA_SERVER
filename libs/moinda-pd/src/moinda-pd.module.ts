import { Module } from '@nestjs/common';
import { MoindaPdService } from './moinda-pd.service';

@Module({
  providers: [MoindaPdService],
  exports: [MoindaPdService],
})
export class MoindaPdModule {}
