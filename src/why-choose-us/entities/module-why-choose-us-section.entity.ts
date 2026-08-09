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
import { ModuleWhyChooseUsFeature } from './module-why-choose-us-feature.entity';

@Entity('module_why_choose_us_sections')
export class ModuleWhyChooseUsSection {
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

  @OneToMany(
    () => ModuleWhyChooseUsFeature,
    (feature) => feature.whyChooseUsSection,
  )
  features: ModuleWhyChooseUsFeature[];

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
