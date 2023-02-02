import { Module } from '@nestjs/common';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { PdReadStudyEntity } from '@app/moinda-pd/read/entity/pd.read.study.entity';
import { IdService } from '@app/moinda-pd/service/pd.id.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyEntity, UserEntity]),
    TypeOrmModule.forFeature([PdReadStudyEntity], DB_READ_NAME),
    // TypeOrmExModule.forCustomRepository([UserRepository, StudyRepository]),
    // TypeOrmExModule.forCustomRepository([
    //   PdReadUserRepository,
    //   PdReadStudyRepository,
    // ]),
  ],
  controllers: [StudyController],
  providers: [StudyService, IdService],
})
export class StudyModule {}
