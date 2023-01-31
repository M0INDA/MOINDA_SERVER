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
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { PdReadStudyEntity } from '@app/moinda-pd/read/entity/pd.read.study.entity';

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
  providers: [StudyService],
})
export class StudyModule {}
