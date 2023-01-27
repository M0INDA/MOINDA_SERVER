import { PdReadStudyRepository } from '@app/moinda-pd/read/repository/pd.read.study.repository';
import { StudyRepository } from '@app/moinda-pd/repository/study.repository';
import { PdReadUserRepository } from '@app/moinda-pd/read/repository/pd.read.user.repository';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';
import { Module } from '@nestjs/common';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { TypeOrmExModule } from '@app/moinda-pd/CustomRepository/typeorm-ex.module';
import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, StudyRepository]),
    TypeOrmModule.forFeature([UserRepository, StudyRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository, StudyRepository]),
    TypeOrmExModule.forCustomRepository([
      PdReadUserRepository,
      PdReadStudyRepository,
    ]),
  ],
  controllers: [StudyController],
  providers: [StudyService],
})
export class StudyModule {}
