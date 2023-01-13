import { EntityRepository, Repository } from 'typeorm';
import { StudyEntity } from '../entity/study.entity';

@EntityRepository(StudyEntity)
export class StudyRepository extends Repository<StudyEntity> {}
