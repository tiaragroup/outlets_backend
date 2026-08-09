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

@Entity('module_promotions')
export class ModulePromotion {
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
    name: 'button_url',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  buttonUrl: string | null;

  @Column({
    name: 'starts_at',
    type: 'timestamptz',
    nullable: true,
  })
  startsAt: Date | null;

  @Column({
    name: 'ends_at',
    type: 'timestamptz',
    nullable: true,
  })
  endsAt: Date | null;

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
