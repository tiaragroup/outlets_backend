import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModuleIdToSocialLinks1710000000006
  implements MigrationInterface
{
  name = 'AddModuleIdToSocialLinks1710000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE social_links
      ADD COLUMN IF NOT EXISTS module_id BIGINT NULL;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_social_links_module'
        ) THEN
          ALTER TABLE social_links
          ADD CONSTRAINT fk_social_links_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_social_links_module_id
      ON social_links(module_id);
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_social_links_module_name
      ON social_links(module_id, name)
      WHERE module_id IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS uq_social_links_module_name;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_social_links_module_id;
    `);

    await queryRunner.query(`
      ALTER TABLE social_links
      DROP CONSTRAINT IF EXISTS fk_social_links_module;
    `);

    await queryRunner.query(`
      ALTER TABLE social_links
      DROP COLUMN IF EXISTS module_id;
    `);
  }
}