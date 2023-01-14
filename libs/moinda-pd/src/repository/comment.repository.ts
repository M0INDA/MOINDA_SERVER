import { Repository } from 'typeorm';
import { CommentEntity } from '../entity/comment.entity';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';

@CustomRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {}
