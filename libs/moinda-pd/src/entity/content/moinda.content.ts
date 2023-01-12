import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class WayContent extends BaseEntity {
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

