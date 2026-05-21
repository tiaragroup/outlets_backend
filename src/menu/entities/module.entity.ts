import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuCategory } from './menu-category.entity';
import { MenuItem } from './menu-item.entity';
import { MenuAddon } from './menu-addon.entity';

@Entity('modules')
export class OutletModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 150 })
  slug: string;

  @Column({ default: 0 })
  priority: number;

  @Column({ nullable: true, length: 500 })
  logo: string;

  @Column({ name: 'cover_image', nullable: true, length: 500 })
  coverImage: string;

  @Column({ name: 'auth_image', nullable: true, length: 500 })
  authImage: string;

  @Column({ name: 'primary_color', nullable: true, length: 30 })
  primaryColor: string;

  @Column({ name: 'secondary_color', nullable: true, length: 30 })
  secondaryColor: string;

  @Column({ name: 'light_color', nullable: true, length: 30 })
  lightColor: string;

  @Column({ name: 'text_color', nullable: true, length: 30 })
  textColor: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => MenuCategory, (category) => category.module)
  categories: MenuCategory[];

  @OneToMany(() => MenuItem, (item) => item.module)
  items: MenuItem[];

  @OneToMany(() => MenuAddon, (addon) => addon.module)
  addons: MenuAddon[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}