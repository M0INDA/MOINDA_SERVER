import { TestingModule } from '@nestjs/testing';
import { StudyService } from './../study/study.service';
import { PdReadMemberEntity } from '@app/moinda-pd/read/entity/pd.read.member.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { DB_READ_NAME, STUDY } from '@app/moinda-pd/constant.model';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { PdReadStudyEntity } from '@app/moinda-pd/read/entity/pd.read.study.entity';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, skip } from 'rxjs';
import { In, Repository } from 'typeorm';
import { start } from 'repl';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(StudyEntity)
    private readonly studyRepository: Repository<StudyEntity>,
    private readonly studyService: StudyService,
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
    const studys = await this.pdReadStudyRepository.find({
      where: { category: category },
      order: { createdAt: 'DESC' },
      take: 5,
    });
    const startDates = studys.map((a) => a.startDate);
    const dDays = [];
    const today = new Date();
    for (let i = 0; i < startDates.length; i++) {
      const dday = new Date(startDates[i]);
      const gap = dday.getTime() - today.getTime();
      const result = Math.ceil(gap / (1000 * 60 * 60 * 24));
      dDays.push(result);
    }
    return studys.map((a, i) => {
      return Object.assign(a, { DDay: dDays[i] });
    });
  }

  async getMyStudy(user: UserEntity) {
    const member = await this.pdReadMemberRepository.find({
      where: { userId: user.id },
    });
    const studyIds = member.map((a) => a.studyId);
    const studys = await this.pdReadStudyRepository.find({
      where: { id: In(studyIds) },
      order: { createdAt: 'DESC' },
      take: 3,
    });

    return studys;
  }
}
