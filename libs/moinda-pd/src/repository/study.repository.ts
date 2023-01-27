import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { StudyEntity } from '../entity/study.entity';

@CustomRepository(StudyEntity)
export class StudyRepository extends Repository<StudyEntity> {}
