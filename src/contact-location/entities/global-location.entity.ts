import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

const numberTransformer = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};

@Entity('global_locations')
export class GlobalLocation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true, length: 500 })
  address: string;

  @Column({ nullable: true, length: 150 })
  city: string;

  @Column({ nullable: true, length: 150 })
  country: string;

  @Column({ name: 'map_url', nullable: true, length: 1000 })
  mapUrl: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 7,
    nullable: true,
    transformer: numberTransformer,
  })
  latitude: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 7,
    nullable: true,
    transformer: numberTransformer,
  })
  longitude: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}