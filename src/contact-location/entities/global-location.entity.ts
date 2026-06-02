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

const numberTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};

@Entity('global_locations')
export class GlobalLocation {
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
    length: 500,
    nullable: true,
  })
  address: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  city: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  country: string | null;

  @Column({
    name: 'map_url',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  mapUrl: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 7,
    nullable: true,
    transformer: numberTransformer,
  })
  latitude: number | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 7,
    nullable: true,
    transformer: numberTransformer,
  })
  longitude: number | null;

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