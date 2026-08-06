import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleGalleries1710000000013 implements MigrationInterface {
  name = 'CreateModuleGalleries1710000000013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE module_galleries (
        id BIGSERIAL PRIMARY KEY,

        module_id BIGINT NOT NULL,

        slug VARCHAR(150),

        image VARCHAR(1000),

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_galleries_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_gallery_slug
          UNIQUE (module_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_galleries_module_id
      ON module_galleries(module_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_galleries_is_active
      ON module_galleries(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS module_galleries;`);
  }
}
