import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class MoindaContent extends BaseEntity {
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
