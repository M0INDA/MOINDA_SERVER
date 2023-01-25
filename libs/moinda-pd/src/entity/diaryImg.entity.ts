import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DIARYIMG } from '../constant.model';
import { MoindaContent } from './content/moinda.content';
import { DiaryEntity } from './diary.entity';

@Entity({ name: DIARYIMG })
export class DiaryImgEntity extends MoindaContent {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  diaryImg!: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  diaryId?: string;

  @ManyToOne(() => DiaryEntity, (diary) => diary.diaryimgs)
  diary: DiaryEntity;
}
