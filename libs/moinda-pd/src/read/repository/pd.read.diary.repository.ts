import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { PdReadDiaryEntity } from '../entity/pd.read.diary.entity';

@CustomRepository(PdReadDiaryEntity)
export class PdReadDiaryRepository extends Repository<PdReadDiaryEntity> {}
