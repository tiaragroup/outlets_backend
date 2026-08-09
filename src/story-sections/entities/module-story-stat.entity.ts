import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModuleStorySection } from './module-story-section.entity';

@Entity('module_story_stats')
export class ModuleStoryStat {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'story_section_id',
    type: 'bigint',
  })
  storySectionId: number;

  @ManyToOne(() => ModuleStorySection, (section) => section.stats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'story_section_id' })
  storySection: ModuleStorySection;

  @Column({
    type: 'varchar',
    length: 150,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  icon: string | null;

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
