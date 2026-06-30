import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutletModule } from '../../menu/entities/module.entity';

@Entity('social_links')
export class SocialLink {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'module_id',
    type: 'bigint',
    nullable: true,
  })
  moduleId: number | null;

  @ManyToOne(() => OutletModule, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: OutletModule | null;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  icon: string | null;

  @Column({
    type: 'varchar',
    length: 500,
  })
  url: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}