import { EntityRepository, Repository } from 'typeorm';
import { PdReadDiaryEntity } from '../entity/pd.read.diary.entity';

@EntityRepository(PdReadDiaryEntity)
export class PdReadDiaryRepository extends Repository<PdReadDiaryEntity> {}
