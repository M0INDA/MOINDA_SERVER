import { HashtagEntity } from './entity/hashtag.entity';
import { PdReadCheckInEntity } from './read/entity/pd.read.checkIn.entity';
import { PdReadRatingEntity } from './read/entity/pd.read.rating.entity';
import { CheckInEntity } from './entity/checkIn.entity';
import { RatingEntity } from './entity/rating.entity';
import { PdReadApproveEntity } from './read/entity/pd.read.approve.entity';
import { PdReadChatEntity } from './read/entity/pd.read.chat.entity';
import { PdReadCommentEntity } from './read/entity/pd.read.comment.entity';
import { PdReadDiaryEntity } from './read/entity/pd.read.diary.entity';
import { PdReadDiaryImgEntity } from './read/entity/pd.read.diaryImg.entity';
import { PdReadStudyEntity } from './read/entity/pd.read.study.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_READ_NAME } from './constant.model';
import { UserEntity } from './entity/user.entity';
import { PdReadUserEntity } from './read/entity/pd.read.user.entity';
import { IdService } from './service/pd.id.service';
import { StudyEntity } from './entity/study.entity';
import { DiaryImgEntity } from './entity/diaryImg.entity';
import { DiaryEntity } from './entity/diary.entity';
import { CommentEntity } from './entity/comment.entity';
import { ChatEntity } from './entity/chat.entity';
import { ApproveEntity } from './entity/approve.entity';
import { MemberEntity } from './entity/memeber.entity';
import { PdReadMemberEntity } from './read/entity/pd.read.member.entity';
import { PdReadAttendanceEntity } from './read/entity/pd.read.attendance.entity';
import { AttendanceEntity } from './entity/attendance.entity';
import { PdReadHashtagEntity } from './read/entity/pd.read.hashtag.entity';

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
        MemberEntity,
        AttendanceEntity,
        HashtagEntity,
        CommentEntity,
        ChatEntity,
        ApproveEntity,
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
        PdReadMemberEntity,
        PdReadAttendanceEntity,
        PdReadCommentEntity,
        PdReadHashtagEntity,
        PdReadChatEntity,
        PdReadApproveEntity,
        PdReadRatingEntity,
        PdReadCheckInEntity,
      ],
    }),
  ],
  providers: [IdService],
  exports: [IdService],
})
export class MoindaPdModule {}
