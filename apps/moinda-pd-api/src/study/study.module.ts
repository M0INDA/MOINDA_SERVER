import { PdReadUserEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.user.entity';
import { PdReadStudyEntity } from './../../../../libs/moinda-pd/src/read/entity/pd.read.study.entity';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { UserModule } from './../user/pd.user.module';
import { AuthModule } from './../auth/auth.module';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
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
    TypeOrmModule.forFeature([StudyEntity, UserEntity]),
    TypeOrmModule.forFeature(
      [PdReadStudyEntity, PdReadUserEntity],
      DB_READ_NAME,
    ),
    // TypeOrmExModule.forCustomRepository([StudyRepository]),
    // TypeOrmExModule.forCustomRepository([
    //   PdReadUserRepository,
    //   PdReadStudyRepository,
    // ]),
  ],
  controllers: [StudyController],
  providers: [StudyService, IdService, AuthModule, UserModule],
})
export class StudyModule {}
