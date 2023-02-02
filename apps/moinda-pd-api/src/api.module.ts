import { JwtStrategy } from './security/passport.jwt.strategy';
import { PdReadCheckInRepository } from './../../../libs/moinda-pd/src/read/repository/pd.read.checkIn.repository';
import { PdReadRatingRepository } from './../../../libs/moinda-pd/src/read/repository/pd.read.rating.repository';
import { PdReadScoreRepository } from './../../../libs/moinda-pd/src/read/repository/pd.read.score.repository';
import { CheckInRepository } from './../../../libs/moinda-pd/src/repository/checkIn.repository';
import { RatingRepository } from './../../../libs/moinda-pd/src/repository/rating.repository';
import { ScoreRepository } from './../../../libs/moinda-pd/src/repository/score.repository';
import { MoindaPdModule } from '@app/moinda-pd';
import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { PdReadApproveRepository } from '@app/moinda-pd/read/repository/pd.read.approve.repository';
import { PdReadChatRepository } from '@app/moinda-pd/read/repository/pd.read.chat.repository';
import { PdReadCommentRepository } from '@app/moinda-pd/read/repository/pd.read.comment.repository';
import { PdReadDiaryRepository } from '@app/moinda-pd/read/repository/pd.read.diary.repository';
import { PdReadDiaryImgRepository } from '@app/moinda-pd/read/repository/pd.read.diaryImg.repository';
import { PdReadStudyRepository } from '@app/moinda-pd/read/repository/pd.read.study.repository';
import { PdReadUserRepository } from '@app/moinda-pd/read/repository/pd.read.user.repository';
import { ApproveRepository } from '@app/moinda-pd/repository/approve.repository';
import { ChatRepository } from '@app/moinda-pd/repository/chat.repository';
import { CommentRepository } from '@app/moinda-pd/repository/comment.repository';
import { DiaryRepository } from '@app/moinda-pd/repository/diary.repository';
import { DiaryImgRepository } from '@app/moinda-pd/repository/diaryImg.repository';
import { StudyRepository } from '@app/moinda-pd/repository/study.repository';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/pd.user.module';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { StudyController } from './study/study.controller';
import { StudyService } from './study/study.service';
import { TypeOrmExModule } from '@app/moinda-pd/CustomRepository/typeorm-ex.module';
import { UserController } from './user/pd.user.controller';
import { UserService } from './user/pd.user.service';
import { UserEntity } from '@app/moinda-pd/entity/user.entity';
import { StudyEntity } from '@app/moinda-pd/entity/study.entity';
import { DiaryEntity } from '@app/moinda-pd/entity/diary.entity';
import { DiaryImgEntity } from '@app/moinda-pd/entity/diaryImg.entity';
import { CommentEntity } from '@app/moinda-pd/entity/comment.entity';
import { ChatEntity } from '@app/moinda-pd/entity/chat.entity';
import { ApproveEntity } from '@app/moinda-pd/entity/approve.entity';
import { ScoreEntity } from '@app/moinda-pd/entity/score.entity';
import { RatingEntity } from '@app/moinda-pd/entity/rating.entity';
import { CheckInEntity } from '@app/moinda-pd/entity/checkIn.entity';
import { PdReadUserEntity } from '@app/moinda-pd/read/entity/pd.read.user.entity';
import { PdReadStudyEntity } from '@app/moinda-pd/read/entity/pd.read.study.entity';
import { PdReadDiaryImgEntity } from '@app/moinda-pd/read/entity/pd.read.diaryImg.entity';
import { PdReadDiaryEntity } from '@app/moinda-pd/read/entity/pd.read.diary.entity';
import { PdReadCommentEntity } from '@app/moinda-pd/read/entity/pd.read.comment.entity';
import { PdReadChatEntity } from '@app/moinda-pd/read/entity/pd.read.chat.entity';
import { PdReadApproveEntity } from '@app/moinda-pd/read/entity/pd.read.approve.entity';
import { PdReadScoreEntity } from '@app/moinda-pd/read/entity/pd.read.score.entity';
import { PdReadRatingEntity } from '@app/moinda-pd/read/entity/pd.read.rating.entity';
import { PdReadCheckInEntity } from '@app/moinda-pd/read/entity/pd.read.checkIn.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MainController } from './main/main.controller';
import { MainService } from './main/main.service';
import { MemberEntity } from '@app/moinda-pd/entity/memeber.entity';
import { PdReadMemberEntity } from '@app/moinda-pd/read/entity/pd.read.member.entity';
import { PdReadAttendanceEntity } from '@app/moinda-pd/read/entity/pd.read.attendance.entity';
import { AttendanceEntity } from '@app/moinda-pd/entity/attendance.entity';

@Module({
  imports: [
    MoindaPdModule,
    ConfigModule,
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([
      UserEntity,
      StudyEntity,
      DiaryImgEntity,
      DiaryEntity,
      MemberEntity,
      CommentEntity,
      ChatEntity,
      AttendanceEntity,
      ApproveEntity,
      ScoreEntity,
      RatingEntity,
      CheckInEntity,
    ]),
    TypeOrmModule.forFeature(
      [
        PdReadUserEntity,
        PdReadStudyEntity,
        PdReadDiaryImgEntity,
        PdReadDiaryEntity,
        PdReadMemberEntity,
        PdReadCommentEntity,
        PdReadAttendanceEntity,
        PdReadChatEntity,
        PdReadApproveEntity,
        PdReadScoreEntity,
        PdReadRatingEntity,
        PdReadCheckInEntity,
      ],
      DB_READ_NAME,
    ),
    // TypeOrmExModule.forCustomRepository([
    //   UserRepository,
    //   StudyRepository,
    //   DiaryImgRepository,
    //   DiaryRepository,
    //   CommentRepository,
    //   ChatRepository,
    //   ApproveRepository,
    //   ScoreRepository,
    //   RatingRepository,
    //   CheckInRepository,
    //   PdReadUserRepository,
    //   PdReadStudyRepository,
    //   PdReadDiaryImgRepository,
    //   PdReadDiaryRepository,
    //   PdReadCommentRepository,
    //   PdReadChatRepository,
    //   PdReadApproveRepository,
    //   PdReadScoreRepository,
    //   PdReadRatingRepository,
    //   PdReadCheckInRepository,
    // ]),
    // HttpModule.registerAsync({
    //   useFactory: () => ({
    //     timeout: 1000,
    //     maxRedirects: 3,
    //   }),
    // }),
  ],
  controllers: [ApiController, StudyController, MainController],
  providers: [IdService, ApiService, StudyService, JwtStrategy, MainService],
})
export class ApiModule {}
