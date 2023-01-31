import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'node:path';
import { PdReadUserEntity } from './read/entity/pd.read.user.entity';
import { PdReadStudyEntity } from './read/entity/pd.read.study.entity';
import { PdReadDiaryImgEntity } from './read/entity/pd.read.diaryImg.entity';
import { PdReadDiaryEntity } from './read/entity/pd.read.diary.entity';
import { PdReadCommentEntity } from './read/entity/pd.read.comment.entity';
import { PdReadChatEntity } from './read/entity/pd.read.chat.entity';
import { PdReadApproveEntity } from './read/entity/pd.read.approve.entity';
import { PdReadScoreEntity } from './read/entity/pd.read.score.entity';
import { PdReadRatingEntity } from './read/entity/pd.read.rating.entity';
import { PdReadCheckInEntity } from './read/entity/pd.read.checkIn.entity';
// import { DB_READ_NAME } from './constant.model';
import { UserEntity } from './entity/user.entity';
import { StudyEntity } from './entity/study.entity';
import { DiaryImgEntity } from './entity/diaryImg.entity';
import { DiaryEntity } from './entity/diary.entity';
import { CommentEntity } from './entity/comment.entity';
import { ChatEntity } from './entity/chat.entity';
import { ApproveEntity } from './entity/approve.entity';
import { ScoreEntity } from './entity/score.entity';
import { RatingEntity } from './entity/rating.entity';
import { CheckInEntity } from './entity/checkIn.entity';

const isTest = process.env.NODE_ENV === 'test';

export const options: DataSourceOptions = {
  //   database: isTest ? ':memory:' : join(process.cwd(), 'db.sqlite3'),
  name: 'default',
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+09:00',
  //   keepConnectionAlive: true,
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
};

// export const readOptions: DataSourceOptions = {
//   //   database: isTest ? ':memory:' : join(process.cwd(), 'db.sqlite3'),
//   name: DB_READ_NAME,
//   type: 'mysql',
//   host: process.env.DB_HOST,
//   port: 3306,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: join(process.cwd(), 'moinda'),
//   timezone: '+09:00',
//   //   keepConnectionAlive: true,
//   // logging: process.env.DB_LOGGING == 'true',
//   synchronize: process.env.DB_SYNCHRONIZE == 'true',
//   entities: [
//     PdReadUserEntity,
//     PdReadStudyEntity,
//     PdReadDiaryImgEntity,
//     PdReadDiaryEntity,
//     PdReadCommentEntity,
//     PdReadChatEntity,
//     PdReadApproveEntity,
//     PdReadScoreEntity,
//     PdReadRatingEntity,
//     PdReadCheckInEntity,
//   ],
// };

// Use with TypeORM CLI
export const AppDataSource = new DataSource(options);
// export const AppReadDataSource = new DataSource(readOptions);
