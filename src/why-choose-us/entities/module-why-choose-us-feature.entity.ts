import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModuleWhyChooseUsSection } from './module-why-choose-us-section.entity';

@Entity('module_why_choose_us_features')
export class ModuleWhyChooseUsFeature {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'why_choose_us_section_id',
    type: 'bigint',
  })
  whyChooseUsSectionId: number;

  @ManyToOne(() => ModuleWhyChooseUsSection, (section) => section.features, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'why_choose_us_section_id' })
  whyChooseUsSection: ModuleWhyChooseUsSection;

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
