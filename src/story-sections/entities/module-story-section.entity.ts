import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutletModule } from '../../menu/entities/module.entity';
import { ModuleStoryStat } from './module-story-stat.entity';

@Entity('module_story_sections')
export class ModuleStorySection {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'module_id',
    type: 'bigint',
  })
  moduleId: number;

  @ManyToOne(() => OutletModule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: OutletModule;

  @Column({
    type: 'varchar',
    length: 150,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  image: string | null;

  @Column({
    name: 'mobile_image',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  mobileImage: string | null;

  @Column({
    type: 'integer',
    default: 0,
  })
  priority: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => ModuleStoryStat, (stat) => stat.storySection)
  stats: ModuleStoryStat[];

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
