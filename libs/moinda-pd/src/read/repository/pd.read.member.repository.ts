import { EntityRepository, Repository } from 'typeorm';
import { PdReadMemberEntity } from '../entity/pd.read.member.entity';

@EntityRepository(PdReadMemberEntity)
export class PdReadMemberRepository extends Repository<PdReadMemberEntity> {}
