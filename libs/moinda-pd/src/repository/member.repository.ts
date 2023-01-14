import { Repository } from 'typeorm';
import { MemberEntity } from '../entity/member.entity';
import { CustomRepository } from '../CustomRepository/typeorm-ex.decorator';

@CustomRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {}
