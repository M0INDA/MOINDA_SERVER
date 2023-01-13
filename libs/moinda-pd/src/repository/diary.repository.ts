import { EntityRepository, Repository } from 'typeorm';
import { DiaryEntity } from '../entity/diary.entity';

@EntityRepository(DiaryEntity)
export class DiaryRepository extends Repository<DiaryEntity> {}
