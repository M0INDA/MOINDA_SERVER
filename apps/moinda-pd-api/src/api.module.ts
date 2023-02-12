import { JwtStrategy } from './security/passport.jwt.strategy';
import { MoindaPdModule } from '@app/moinda-pd';
import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/pd.user.module';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { StudyController } from './study/study.controller';
import { StudyService } from './study/study.service';
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
