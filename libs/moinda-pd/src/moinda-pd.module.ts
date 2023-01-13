import { PdReadApproveEntity } from './read/entity/pd.read.approve.entity';
import { PdReadChatEntity } from './read/entity/pd.read.chat.entity';
import { PdReadCommentEntity } from './read/entity/pd.read.comment.entity';
import { PdReadDiaryEntity } from './read/entity/pd.read.diary.entity';
import { PdReadDiaryImgEntity } from './read/entity/pd.read.diaryImg.entity';
import { PdReadMemberEntity } from './read/entity/pd.read.member.entity';
import { PdReadStudyEntity } from './read/entity/pd.read.study.entity';
import { PdReadApproveRepository } from './read/repository/pd.read.approve.repository';
import { PdReadChatRepository } from './read/repository/pd.read.chat.repository';
import { PdReadCommentRepository } from './read/repository/pd.read.comment.repository';
import { PdReadDiaryRepository } from './read/repository/pd.read.diary.repository';
import { PdReadDiaryImgRepository } from './read/repository/pd.read.diaryImg.repository';
import { PdReadMemberRepository } from './read/repository/pd.read.member.repository';
import { PdReadStudyRepository } from './read/repository/pd.read.study.repository';
import { ApproveRepository } from './repository/approve.repository';
import { ChatRepository } from './repository/chat.repository';
import { CommentRepository } from './repository/comment.repository';
import { DiaryRepository } from './repository/diary.repository';
import { DiaryImgRepository } from './repository/diaryImg.repository';
import { MemberRepository } from './repository/member.repository';
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
import { MemberEntity } from './entity/member.entity';
import { DiaryImgEntity } from './entity/diaryImg.entity';
import { DiaryEntity } from './entity/diary.entity';
import { CommentEntity } from './entity/comment.entity';
import { ChatEntity } from './entity/chat.entity';
import { ApproveEntity } from './entity/approve.entity';

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
      keepConnectionAlive: true,
      logging: process.env.DB_LOGGING == 'true',
      synchronize: process.env.DB_SYNCHRONIZE == 'true',
      entities: [
        UserEntity,
        StudyEntity,
        MemberEntity,
        DiaryImgEntity,
        DiaryEntity,
        CommentEntity,
        ChatEntity,
        ApproveEntity,
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
      keepConnectionAlive: true,
      logging: process.env.DB_LOGGING == 'true',
      synchronize: process.env.DB_SYNCHRONIZE == 'true',
      entities: [
        PdReadUserEntity,
        PdReadStudyEntity,
        PdReadMemberEntity,
        PdReadDiaryImgEntity,
        PdReadDiaryEntity,
        PdReadCommentEntity,
        PdReadChatEntity,
        PdReadApproveEntity,
      ],
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      StudyRepository,
      MemberRepository,
      DiaryImgRepository,
      DiaryRepository,
      CommentRepository,
      ChatRepository,
      ApproveRepository,
    ]),
    TypeOrmModule.forFeature(
      [
        PdReadUserRepository,
        PdReadStudyRepository,
        PdReadMemberRepository,
        PdReadDiaryImgRepository,
        PdReadDiaryRepository,
        PdReadCommentRepository,
        PdReadChatRepository,
        PdReadApproveRepository,
      ],
      DB_READ_NAME,
    ),
  ],
  providers: [IdService],
  exports: [IdService],
})
export class MoindaPdModule {}
