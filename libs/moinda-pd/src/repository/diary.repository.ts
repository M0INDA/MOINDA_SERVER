import { Repository } from 'typeorm';
import { DiaryEntity } from '../entity/diary.entity';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';

@CustomRepository(DiaryEntity)
export class DiaryRepository extends Repository<DiaryEntity> {}
