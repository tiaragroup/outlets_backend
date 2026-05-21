import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum TranslationModelType {
  MODULE = 'module',
  MENU_CATEGORY = 'menu_category',
  MENU_ITEM = 'menu_item',
  MENU_ITEM_VARIANT = 'menu_item_variant',
  MENU_ADDON = 'menu_addon',
}

@Entity('translations')
@Unique(['modelType', 'modelId', 'langCode', 'fieldName'])
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'model_type', length: 100 })
  modelType: TranslationModelType;

  @Column({ name: 'model_id' })
  modelId: number;

  @Column({ name: 'lang_code', length: 10 })
  langCode: string;

  @Column({ name: 'field_name', length: 100 })
  fieldName: string;

  @Column({ name: 'field_value', type: 'text', nullable: true })
  fieldValue: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}