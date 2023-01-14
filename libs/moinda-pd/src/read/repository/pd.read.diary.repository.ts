import { Repository } from 'typeorm';
import { PdReadDiaryEntity } from '../entity/pd.read.diary.entity';
import { CustomRepository } from '../../CustomRepository/typeorm-ex.decorator';

@CustomRepository(PdReadDiaryEntity)
export class PdReadDiaryRepository extends Repository<PdReadDiaryEntity> {}
