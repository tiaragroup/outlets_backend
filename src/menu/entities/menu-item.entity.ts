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
import { OutletModule } from './module.entity';
import { MenuCategory } from './menu-category.entity';
import { MenuItemVariant } from './menu-item-variant.entity';
import { MenuItemAddon } from './menu-item-addon.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'module_id' })
  moduleId: number;

  @ManyToOne(() => OutletModule, (module) => module.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: OutletModule;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => MenuCategory, (category) => category.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: MenuCategory;

  @Column({ nullable: true, length: 150 })
  slug: string;

  @Column({ nullable: true, length: 500 })
  image: string;

  @Column({ default: 0 })
  priority: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => MenuItemVariant, (variant) => variant.menuItem)
  variants: MenuItemVariant[];

  @OneToMany(() => MenuItemAddon, (itemAddon) => itemAddon.menuItem)
  itemAddons: MenuItemAddon[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}