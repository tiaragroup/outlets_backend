import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGlobalLocationsAndOutletContacts1710000000003
  implements MigrationInterface
{
  name = 'CreateGlobalLocationsAndOutletContacts1710000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE global_locations (
        id BIGSERIAL PRIMARY KEY,

        address VARCHAR(500),
        city VARCHAR(150),
        country VARCHAR(150),

        map_url VARCHAR(1000),
        latitude NUMERIC(10, 7),
        longitude NUMERIC(10, 7),

        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_global_locations_is_active
      ON global_locations(is_active);
    `);

    await queryRunner.query(`
      CREATE TABLE outlet_contacts (
        id BIGSERIAL PRIMARY KEY,

        module_id BIGINT NULL,

        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(180),
        website_url VARCHAR(500),

        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_outlet_contacts_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_outlet_contacts_module_id
      ON outlet_contacts(module_id)
      WHERE module_id IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_outlet_contacts_name
      ON outlet_contacts(name);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_outlet_contacts_is_active
      ON outlet_contacts(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS outlet_contacts;`);
    await queryRunner.query(`DROP TABLE IF EXISTS global_locations;`);
  }
}