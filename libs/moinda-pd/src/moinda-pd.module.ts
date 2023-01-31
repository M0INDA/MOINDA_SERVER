import { PdReadCheckInRepository } from './read/repository/pd.read.checkIn.repository';
import { PdReadRatingRepository } from './read/repository/pd.read.rating.repository';
import { PdReadScoreRepository } from './read/repository/pd.read.score.repository';
import { CheckInRepository } from './repository/checkIn.repository';
import { RatingRepository } from './repository/rating.repository';
import { ScoreRepository } from './repository/score.repository';
import { PdReadCheckInEntity } from './read/entity/pd.read.checkIn.entity';
import { PdReadRatingEntity } from './read/entity/pd.read.rating.entity';
import { PdReadScoreEntity } from './read/entity/pd.read.score.entity';
import { CheckInEntity } from './entity/checkIn.entity';
import { RatingEntity } from './entity/rating.entity';
import { ScoreEntity } from './entity/score.entity';
import { PdReadApproveEntity } from './read/entity/pd.read.approve.entity';
import { PdReadChatEntity } from './read/entity/pd.read.chat.entity';
import { PdReadCommentEntity } from './read/entity/pd.read.comment.entity';
import { PdReadDiaryEntity } from './read/entity/pd.read.diary.entity';
import { PdReadDiaryImgEntity } from './read/entity/pd.read.diaryImg.entity';
import { PdReadStudyEntity } from './read/entity/pd.read.study.entity';
import { PdReadApproveRepository } from './read/repository/pd.read.approve.repository';
import { PdReadChatRepository } from './read/repository/pd.read.chat.repository';
import { PdReadCommentRepository } from './read/repository/pd.read.comment.repository';
import { PdReadDiaryRepository } from './read/repository/pd.read.diary.repository';
import { PdReadDiaryImgRepository } from './read/repository/pd.read.diaryImg.repository';
import { PdReadStudyRepository } from './read/repository/pd.read.study.repository';
import { ApproveRepository } from './repository/approve.repository';
import { ChatRepository } from './repository/chat.repository';
import { CommentRepository } from './repository/comment.repository';
import { DiaryRepository } from './repository/diary.repository';
import { DiaryImgRepository } from './repository/diaryImg.repository';
import { StudyRepository } from './repository/study.repository';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_READ_NAME } from './constant.model';
import { UserEntity } from './entity/user.entity';
import { PdReadUserEntity } from './read/entity/pd.read.user.entity';
import { PdReadUserRepository } from './read/repository/pd.read.user.repository';
import { UserRepository } from './repository/user.repository';
import { IdService } from './service/pd.id.service';
import { StudyEntity } from './entity/study.entity';
import { DiaryImgEntity } from './entity/diaryImg.entity';
import { DiaryEntity } from './entity/diary.entity';
import { CommentEntity } from './entity/comment.entity';
import { ChatEntity } from './entity/chat.entity';
import { ApproveEntity } from './entity/approve.entity';
import { DataSource } from 'typeorm';
import { TypeOrmExModule } from './CustomRepository/typeorm-ex.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'ci'
          ? './libs/moinda-pd/environment/.env.ci'
          : './libs/moinda-pd/environment/.env.local',
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: '+09:00',
      keepConnectionAlive: true,
      // logging: process.env.DB_LOGGING == 'true',
      synchronize: process.env.DB_SYNCHRONIZE == 'true',
      entities: [
        UserEntity,
        StudyEntity,
        DiaryImgEntity,
        DiaryEntity,
        CommentEntity,
        ChatEntity,
        ApproveEntity,
        ScoreEntity,
        RatingEntity,
        CheckInEntity,
      ],
    }),

    TypeOrmModule.forRoot({
      name: DB_READ_NAME,
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: '+09:00',

      keepConnectionAlive: true,
      // logging: process.env.DB_LOGGING == 'true',
      synchronize: process.env.DB_SYNCHRONIZE == 'true',
      entities: [
        PdReadUserEntity,
        PdReadStudyEntity,
        PdReadDiaryImgEntity,
        PdReadDiaryEntity,
        PdReadCommentEntity,
        PdReadChatEntity,
        PdReadApproveEntity,
        PdReadScoreEntity,
        PdReadRatingEntity,
        PdReadCheckInEntity,
      ],
    }),
    // TypeOrmModule.forRootAsync(options),
    // TypeOrmModule.forRootAsync(readOptions),
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
  ],
  providers: [IdService],
  exports: [IdService],
})
export class MoindaPdModule {}
