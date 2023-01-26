import { CustomRepository } from '@app/moinda-pd/CustomRepository/typeorm-ex.decorator';
import { EntityRepository, Repository } from 'typeorm';
import { CommentEntity } from '../entity/comment.entity';

@CustomRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {}
