import { Repository } from 'typeorm';
import { PdReadCommentEntity } from '../entity/pd.read.comment.entity';
import { CustomRepository } from '../../CustomRepository/typeorm-ex.decorator';

@CustomRepository(PdReadCommentEntity)
export class PdReadCommentRepository extends Repository<PdReadCommentEntity> {}
