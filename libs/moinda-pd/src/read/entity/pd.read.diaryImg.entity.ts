import { Entity, ManyToOne } from 'typeorm';
import { DiaryImgEntity } from '@app/moinda-pd/entity/diaryImg.entity';
import { DIARYIMG } from '@app/moinda-pd/constant.model';
import { PdReadDiaryEntity } from './pd.read.diary.entity';

@Entity({ name: DIARYIMG })
export class PdReadDiaryImgEntity extends DiaryImgEntity {
  @ManyToOne(() => PdReadDiaryEntity, (diary) => diary.diaryimgs)
  override diary: PdReadDiaryEntity;
}
