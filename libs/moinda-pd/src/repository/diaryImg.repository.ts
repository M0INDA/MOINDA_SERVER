import { EntityRepository, Repository } from 'typeorm';
import { DiaryImgEntity } from '../entity/diaryImg.entity';

@EntityRepository(DiaryImgEntity)
export class DiaryImgRepository extends Repository<DiaryImgEntity> {}
