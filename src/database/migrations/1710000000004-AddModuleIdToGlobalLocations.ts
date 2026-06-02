import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModuleIdToGlobalLocations1710000000004
  implements MigrationInterface
{
  name = 'AddModuleIdToGlobalLocations1710000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE global_locations
      ADD COLUMN IF NOT EXISTS module_id BIGINT NULL;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_global_locations_module'
        ) THEN
          ALTER TABLE global_locations
          ADD CONSTRAINT fk_global_locations_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_global_locations_module_id
      ON global_locations(module_id)
      WHERE module_id IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_global_locations_module_id
      ON global_locations(module_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_global_locations_module_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS uq_global_locations_module_id;
    `);

    await queryRunner.query(`
      ALTER TABLE global_locations
      DROP CONSTRAINT IF EXISTS fk_global_locations_module;
    `);

    await queryRunner.query(`
      ALTER TABLE global_locations
      DROP COLUMN IF EXISTS module_id;
    `);
  }
}