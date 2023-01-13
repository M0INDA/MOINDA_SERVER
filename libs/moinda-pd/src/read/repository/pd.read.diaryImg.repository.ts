import { EntityRepository, Repository } from 'typeorm';
import { PdReadDiaryImgEntity } from '../entity/pd.read.diaryImg.entity';

@EntityRepository(PdReadDiaryImgEntity)
export class PdReadDiaryImgRepository extends Repository<PdReadDiaryImgEntity> {}
