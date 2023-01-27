import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { PdReadCommentEntity } from '../entity/pd.read.comment.entity';

@CustomRepository(PdReadCommentEntity)
export class PdReadCommentRepository extends Repository<PdReadCommentEntity> {}
