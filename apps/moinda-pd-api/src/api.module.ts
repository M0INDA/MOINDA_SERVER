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
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/pd.user.module';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { StudyController } from './study/study.controller';
import { StudyService } from './study/study.service';
import { TypeOrmExModule } from '@app/moinda-pd/CustomRepository/typeorm-ex.module';

@Module({
  imports: [
    MoindaPdModule,
    ConfigModule,
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([
      UserRepository,
      StudyRepository,
      DiaryImgRepository,
      DiaryRepository,
      CommentRepository,
      ChatRepository,
      ApproveRepository,
      ScoreRepository,
      RatingRepository,
      CheckInRepository,
    ]),
    TypeOrmModule.forFeature(
      [
        PdReadUserRepository,
        PdReadStudyRepository,
        PdReadDiaryImgRepository,
        PdReadDiaryRepository,
        PdReadCommentRepository,
        PdReadChatRepository,
        PdReadApproveRepository,
        PdReadScoreRepository,
        PdReadRatingRepository,
        PdReadCheckInRepository,
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
  controllers: [ApiController, StudyController],
  providers: [IdService, ApiService, StudyService],
})
export class ApiModule {}
