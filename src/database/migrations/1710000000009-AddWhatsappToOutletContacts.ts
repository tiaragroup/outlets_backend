import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWhatsappToOutletContacts1710000000009
  implements MigrationInterface
{
  name = 'AddWhatsappToOutletContacts1710000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE outlet_contacts
      ADD COLUMN whatsapp_number VARCHAR(50),
      ADD COLUMN whatsapp_url VARCHAR(500)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE outlet_contacts
      DROP COLUMN IF EXISTS whatsapp_url,
      DROP COLUMN IF EXISTS whatsapp_number
    `);
  }
}