import { EntityRepository, Repository } from 'typeorm';
import { PdReadCommentEntity } from '../entity/pd.read.comment.entity';

@EntityRepository(PdReadCommentEntity)
export class PdReadCommentRepository extends Repository<PdReadCommentEntity> {}
