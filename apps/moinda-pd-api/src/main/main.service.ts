import { PdReadMemberEntity } from '@app/moinda-pd/read/entity/pd.read.member.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { DB_READ_NAME, STUDY } from '@app/moinda-pd/constant.model';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { PdReadStudyEntity } from '@app/moinda-pd/read/entity/pd.read.study.entity';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { skip } from 'rxjs';
import { In, Repository } from 'typeorm';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(StudyEntity)
    private readonly studyRepository: Repository<StudyEntity>,
    private readonly idService: IdService,
    @InjectRepository(PdReadStudyEntity, DB_READ_NAME)
    private readonly pdReadStudyRepository: Repository<PdReadStudyEntity>,
    @InjectRepository(PdReadMemberEntity, DB_READ_NAME)
    private readonly pdReadMemberRepository: Repository<PdReadMemberEntity>,
  ) {}

  async getNewStudy() {
    return this.pdReadStudyRepository.find({
      order: { createdAt: 'DESC' },
      take: 6,
    });
  }

  async getBestStudy(category: string): Promise<StudyEntity[]> {
    return this.pdReadStudyRepository.find({
      where: { category: category },
      order: { createdAt: 'DESC' },
      take: 6,
    });
  }

  async getMyStudy(user: UserEntity): Promise<StudyEntity[]> {
    const members = await this.pdReadMemberRepository.find({
      where: { userId: user.id },
    });
    const studyIds = members.map((a) => a.studyId);
    return await this.pdReadStudyRepository.find({
      where: { id: In(studyIds) },
      order: { createdAt: 'DESC' },
      take: 6,
    });
  }
}
