import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleLegalContents1710000000005
  implements MigrationInterface
{
  name = 'CreateModuleLegalContents1710000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE module_legal_contents (
        id BIGSERIAL PRIMARY KEY,

        module_id BIGINT NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        slug VARCHAR(150) NOT NULL,

        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_legal_contents_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_legal_content_type
          UNIQUE (module_id, content_type)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_legal_contents_module_id
      ON module_legal_contents(module_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_legal_contents_content_type
      ON module_legal_contents(content_type);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_legal_contents_is_active
      ON module_legal_contents(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS module_legal_contents;`);
  }
}