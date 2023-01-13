import { EntityRepository, Repository } from 'typeorm';
import { MemberEntity } from '../entity/member.entity';

@EntityRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {}
