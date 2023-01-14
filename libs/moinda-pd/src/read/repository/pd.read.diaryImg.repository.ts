import { Repository } from 'typeorm';
import { PdReadDiaryImgEntity } from '../entity/pd.read.diaryImg.entity';
import { CustomRepository } from '../../CustomRepository/typeorm-ex.decorator';

@CustomRepository(PdReadDiaryImgEntity)
export class PdReadDiaryImgRepository extends Repository<PdReadDiaryImgEntity> {}
