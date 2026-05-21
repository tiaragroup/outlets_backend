import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { MenuAddon } from './menu-addon.entity';

@Entity('menu_item_addons')
export class MenuItemAddon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'menu_item_id' })
  menuItemId: number;

  @ManyToOne(() => MenuItem, (item) => item.itemAddons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'addon_id' })
  addonId: number;

  @ManyToOne(() => MenuAddon, (addon) => addon.itemAddons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'addon_id' })
  addon: MenuAddon;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}