import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleStorySections1710000000014
  implements MigrationInterface
{
  name = 'CreateModuleStorySections1710000000014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE module_story_sections (
        id BIGSERIAL PRIMARY KEY,

        module_id BIGINT NOT NULL,

        slug VARCHAR(150) NOT NULL,

        image VARCHAR(1000),
        mobile_image VARCHAR(1000),

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_story_sections_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_story_section_slug
          UNIQUE (module_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_story_sections_module_id
      ON module_story_sections(module_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_story_sections_is_active
      ON module_story_sections(is_active);
    `);

    await queryRunner.query(`
      CREATE TABLE module_story_stats (
        id BIGSERIAL PRIMARY KEY,

        story_section_id BIGINT NOT NULL,

        slug VARCHAR(150) NOT NULL,

        icon VARCHAR(150),

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_story_stats_story_section
          FOREIGN KEY (story_section_id)
          REFERENCES module_story_sections(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_story_stat_slug
          UNIQUE (story_section_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_story_stats_story_section_id
      ON module_story_stats(story_section_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_story_stats_is_active
      ON module_story_stats(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS module_story_stats;`);
    await queryRunner.query(`DROP TABLE IF EXISTS module_story_sections;`);
  }
}
