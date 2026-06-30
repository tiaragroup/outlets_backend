import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleSliders1710000000007 implements MigrationInterface {
  name = 'CreateModuleSliders1710000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE module_sliders (
        id BIGSERIAL PRIMARY KEY,

        module_id BIGINT NOT NULL,

        slug VARCHAR(150) NOT NULL,

        image VARCHAR(1000),
        mobile_image VARCHAR(1000),
        button_url VARCHAR(1000),

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_sliders_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_slider_slug
          UNIQUE (module_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_sliders_module_id
      ON module_sliders(module_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_sliders_is_active
      ON module_sliders(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS module_sliders;`);
  }
}