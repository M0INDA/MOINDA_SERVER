import { MoindaPdModule } from '@app/moinda-pd';
import { DB_READ_NAME } from '@app/moinda-pd/constant.model';
import { PdReadApproveRepository } from '@app/moinda-pd/read/repository/pd.read.approve.repository';
import { PdReadChatRepository } from '@app/moinda-pd/read/repository/pd.read.chat.repository';
import { PdReadCommentRepository } from '@app/moinda-pd/read/repository/pd.read.comment.repository';
import { PdReadDiaryRepository } from '@app/moinda-pd/read/repository/pd.read.diary.repository';
import { PdReadDiaryImgRepository } from '@app/moinda-pd/read/repository/pd.read.diaryImg.repository';
import { PdReadMemberRepository } from '@app/moinda-pd/read/repository/pd.read.member.repository';
import { PdReadStudyRepository } from '@app/moinda-pd/read/repository/pd.read.study.repository';
import { PdReadUserRepository } from '@app/moinda-pd/read/repository/pd.read.user.repository';
import { ApproveRepository } from '@app/moinda-pd/repository/approve.repository';
import { ChatRepository } from '@app/moinda-pd/repository/chat.repository';
import { CommentRepository } from '@app/moinda-pd/repository/comment.repository';
import { DiaryRepository } from '@app/moinda-pd/repository/diary.repository';
import { DiaryImgRepository } from '@app/moinda-pd/repository/diaryImg.repository';
import { MemberRepository } from '@app/moinda-pd/repository/member.repository';
import { StudyRepository } from '@app/moinda-pd/repository/study.repository';
import { UserRepository } from '@app/moinda-pd/repository/user.repository';
import { IdService } from '@app/moinda-pd/service/pd.id.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/pd.user.module';
import { StudyController } from './study/study.controller';
import { StudyService } from './study/study.service';
// import { StudyModule } from './study/study.module';

@Module({
  imports: [
    MoindaPdModule,
    ConfigModule,
    UserModule,
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
    // HttpModule.registerAsync({
    //   useFactory: () => ({
    //     timeout: 1000,
    //     maxRedirects: 3,
    //   }),
    // }),
  ],
  controllers: [StudyController],
  providers: [IdService, StudyService],
})
export class ApiModule {}
