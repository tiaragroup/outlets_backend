import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMenuItemImages1710000000017 implements MigrationInterface {
  name = 'CreateMenuItemImages1710000000017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE menu_item_images (
        id BIGSERIAL PRIMARY KEY,

        menu_item_id BIGINT NOT NULL,

        image VARCHAR(1000),

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_menu_item_images_menu_item
          FOREIGN KEY (menu_item_id)
          REFERENCES menu_items(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_menu_item_images_menu_item_id
      ON menu_item_images(menu_item_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_menu_item_images_is_active
      ON menu_item_images(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS menu_item_images;`);
  }
}
