import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOutletMenuStructure1710000000000
  implements MigrationInterface
{
  name = 'CreateOutletMenuStructure1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE modules (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(150) NOT NULL UNIQUE,
        priority INTEGER NOT NULL DEFAULT 0,
        logo VARCHAR(500),
        cover_image VARCHAR(500),
        auth_image VARCHAR(500),
        primary_color VARCHAR(30),
        secondary_color VARCHAR(30),
        light_color VARCHAR(30),
        text_color VARCHAR(30),
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE translations (
        id SERIAL PRIMARY KEY,
        model_type VARCHAR(100) NOT NULL,
        model_id INTEGER NOT NULL,
        lang_code VARCHAR(10) NOT NULL,
        field_name VARCHAR(100) NOT NULL,
        field_value TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT uq_translation_field
          UNIQUE (model_type, model_id, lang_code, field_name)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE menu_categories (
        id SERIAL PRIMARY KEY,
        module_id INTEGER NOT NULL,
        slug VARCHAR(150) NOT NULL,
        image VARCHAR(500),
        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT fk_menu_categories_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,
        CONSTRAINT uq_menu_category_module_slug
          UNIQUE (module_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE menu_items (
        id SERIAL PRIMARY KEY,
        module_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        slug VARCHAR(150),
        image VARCHAR(500),
        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT fk_menu_items_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_menu_items_category
          FOREIGN KEY (category_id)
          REFERENCES menu_categories(id)
          ON DELETE CASCADE,
        CONSTRAINT uq_menu_item_category_slug
          UNIQUE (category_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE menu_item_variants (
        id SERIAL PRIMARY KEY,
        menu_item_id INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        calories INTEGER,
        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT fk_menu_item_variants_menu_item
          FOREIGN KEY (menu_item_id)
          REFERENCES menu_items(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE menu_addons (
        id SERIAL PRIMARY KEY,
        module_id INTEGER NOT NULL,
        slug VARCHAR(150) NOT NULL,
        price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        calories INTEGER,
        image VARCHAR(500),
        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT fk_menu_addons_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,
        CONSTRAINT uq_menu_addon_module_slug
          UNIQUE (module_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE menu_item_addons (
        id SERIAL PRIMARY KEY,
        menu_item_id INTEGER NOT NULL,
        addon_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT fk_menu_item_addons_menu_item
          FOREIGN KEY (menu_item_id)
          REFERENCES menu_items(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_menu_item_addons_addon
          FOREIGN KEY (addon_id)
          REFERENCES menu_addons(id)
          ON DELETE CASCADE,
        CONSTRAINT uq_menu_item_addon
          UNIQUE (menu_item_id, addon_id)
      );
    `);

    await queryRunner.query(`CREATE INDEX idx_modules_slug ON modules(slug);`);
    await queryRunner.query(`CREATE INDEX idx_translations_model ON translations(model_type, model_id);`);
    await queryRunner.query(`CREATE INDEX idx_translations_lang ON translations(lang_code);`);
    await queryRunner.query(`CREATE INDEX idx_categories_module_id ON menu_categories(module_id);`);
    await queryRunner.query(`CREATE INDEX idx_menu_items_module_id ON menu_items(module_id);`);
    await queryRunner.query(`CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);`);
    await queryRunner.query(`CREATE INDEX idx_variants_menu_item_id ON menu_item_variants(menu_item_id);`);
    await queryRunner.query(`CREATE INDEX idx_addons_module_id ON menu_addons(module_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS menu_item_addons;`);
    await queryRunner.query(`DROP TABLE IF EXISTS menu_addons;`);
    await queryRunner.query(`DROP TABLE IF EXISTS menu_item_variants;`);
    await queryRunner.query(`DROP TABLE IF EXISTS menu_items;`);
    await queryRunner.query(`DROP TABLE IF EXISTS menu_categories;`);
    await queryRunner.query(`DROP TABLE IF EXISTS translations;`);
    await queryRunner.query(`DROP TABLE IF EXISTS modules;`);
  }
}