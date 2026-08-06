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

@Entity('module_hero_sections')
export class ModuleHeroSection {
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
    name: 'background_image',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  backgroundImage: string | null;

  @Column({
    name: 'mobile_background_image',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  mobileBackgroundImage: string | null;

  @Column({
    name: 'primary_button_url',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  primaryButtonUrl: string | null;

  @Column({
    name: 'secondary_button_url',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  secondaryButtonUrl: string | null;

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