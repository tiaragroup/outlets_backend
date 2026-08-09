import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleWhyChooseUs1710000000015 implements MigrationInterface {
  name = 'CreateModuleWhyChooseUs1710000000015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE module_why_choose_us_sections (
        id BIGSERIAL PRIMARY KEY,

        module_id BIGINT NOT NULL,

        slug VARCHAR(150) NOT NULL,

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_why_choose_us_sections_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_why_choose_us_section_slug
          UNIQUE (module_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_why_choose_us_sections_module_id
      ON module_why_choose_us_sections(module_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_why_choose_us_sections_is_active
      ON module_why_choose_us_sections(is_active);
    `);

    await queryRunner.query(`
      CREATE TABLE module_why_choose_us_features (
        id BIGSERIAL PRIMARY KEY,

        why_choose_us_section_id BIGINT NOT NULL,

        slug VARCHAR(150) NOT NULL,

        icon VARCHAR(150),

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_why_choose_us_features_section
          FOREIGN KEY (why_choose_us_section_id)
          REFERENCES module_why_choose_us_sections(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_why_choose_us_feature_slug
          UNIQUE (why_choose_us_section_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_why_choose_us_features_section_id
      ON module_why_choose_us_features(why_choose_us_section_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_why_choose_us_features_is_active
      ON module_why_choose_us_features(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS module_why_choose_us_features;`,
    );

    await queryRunner.query(
      `DROP TABLE IF EXISTS module_why_choose_us_sections;`,
    );
  }
}
