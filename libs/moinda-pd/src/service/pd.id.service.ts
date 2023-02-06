import { HashtagEntity } from './../entity/hashtag.entity';
import { RatingEntity } from './../entity/rating.entity';
import { ChatEntity } from './../entity/chat.entity';
import { CommentEntity } from './../entity/comment.entity';
import { ApproveEntity } from '../entity/approve.entity';
import { StudyEntity } from './../entity/study.entity';
import { customAlphabet } from 'nanoid';
import { UserEntity } from '../entity/user.entity';
import { DiaryImgEntity } from '../entity/diaryImg.entity';
import { DiaryEntity } from '../entity/diary.entity';
import { ScoreEntity } from '../entity/score.entity';
import { CheckInEntity } from '../entity/checkIn.entity';
import { MemberEntity } from '../entity/memeber.entity';
import { AttendanceEntity } from '../entity/attendance.entity';
export class IdService {
  nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVW23456789', 10);

  getId(entity: any): string {
    return IdService.getIdPrefix(entity) + this.nanoid();
  }

  private static getIdPrefix(entity: any): string {
    if (entity instanceof UserEntity) {
      return 'UR';
    } else if (entity instanceof StudyEntity) {
      return 'ST';
    } else if (entity instanceof ApproveEntity) {
      return 'AP';
    } else if (entity instanceof DiaryEntity) {
      return 'DA';
    } else if (entity instanceof DiaryImgEntity) {
      return 'DI';
    } else if (entity instanceof CommentEntity) {
      return 'CO';
    } else if (entity instanceof ChatEntity) {
      return 'CH';
    } else if (entity instanceof ScoreEntity) {
      return 'SC';
    } else if (entity instanceof CheckInEntity) {
      return 'CI';
    } else if (entity instanceof RatingEntity) {
      return 'RA';
    } else if (entity instanceof MemberEntity) {
      return 'ME';
    } else if (entity instanceof AttendanceEntity) {
      return 'AT';
    } else if (entity instanceof HashtagEntity) {
      return 'HA';
    } else {
      return 'ID';
    }
  }
}
