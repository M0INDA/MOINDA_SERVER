import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { PdReadDiaryImgEntity } from '../entity/pd.read.diaryImg.entity';

@CustomRepository(PdReadDiaryImgEntity)
export class PdReadDiaryImgRepository extends Repository<PdReadDiaryImgEntity> {}
