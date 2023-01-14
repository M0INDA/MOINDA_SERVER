import { Repository } from 'typeorm';
import { StudyEntity } from '../entity/study.entity';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';

@CustomRepository(StudyEntity)
export class StudyRepository extends Repository<StudyEntity> {}
