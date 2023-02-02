import { Module } from '@nestjs/common';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { TypeOrmExModule } from '@app/moinda-pd/CustomRepository/typeorm-ex.module';
import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { PdReadStudyEntity } from '@app/moinda-pd/read/entity/pd.read.study.entity';
import { PdReadUserEntity } from '@app/moinda-pd/read/entity/pd.read.user.entity';
import { IdService } from '@app/moinda-pd/service/pd.id.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyEntity, UserEntity]),
    TypeOrmModule.forFeature([PdReadStudyEntity, PdReadUserEntity]),
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
