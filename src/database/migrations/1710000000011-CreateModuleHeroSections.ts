import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleHeroSections1710000000011
  implements MigrationInterface
{
  name = 'CreateModuleHeroSections1710000000011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE module_hero_sections (
        id BIGSERIAL PRIMARY KEY,

        module_id BIGINT NOT NULL,

        slug VARCHAR(150) NOT NULL,

        background_image VARCHAR(1000),
        mobile_background_image VARCHAR(1000),

        primary_button_url VARCHAR(1000),
        secondary_button_url VARCHAR(1000),

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_hero_sections_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_hero_section_slug
          UNIQUE (module_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_hero_sections_module_id
      ON module_hero_sections(module_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_hero_sections_is_active
      ON module_hero_sections(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS module_hero_sections;`);
  }
}