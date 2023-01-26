import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { DiaryImgEntity } from '../entity/diaryImg.entity';

@CustomRepository(DiaryImgEntity)
export class DiaryImgRepository extends Repository<DiaryImgEntity> {}
