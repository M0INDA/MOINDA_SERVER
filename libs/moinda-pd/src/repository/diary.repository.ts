import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { DiaryEntity } from '../entity/diary.entity';

@CustomRepository(DiaryEntity)
export class DiaryRepository extends Repository<DiaryEntity> {}
