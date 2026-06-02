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

@Entity('outlet_contacts')
export class OutletContact {
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
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'module_id' })
  module: OutletModule | null;

  @Column({
    type: 'varchar',
    length: 150,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  phone: string | null;

  @Column({
    type: 'varchar',
    length: 180,
    nullable: true,
  })
  email: string | null;

  @Column({
    name: 'website_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  websiteUrl: string | null;

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