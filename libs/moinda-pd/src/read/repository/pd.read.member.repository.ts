import { Repository } from 'typeorm';
import { PdReadMemberEntity } from '../entity/pd.read.member.entity';
import { CustomRepository } from '../../CustomRepository/typeorm-ex.decorator';

@CustomRepository(PdReadMemberEntity)
export class PdReadMemberRepository extends Repository<PdReadMemberEntity> {}
