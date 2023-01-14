import { Repository } from 'typeorm';
import { DiaryImgEntity } from '../entity/diaryImg.entity';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';

@CustomRepository(DiaryImgEntity)
export class DiaryImgRepository extends Repository<DiaryImgEntity> {}
