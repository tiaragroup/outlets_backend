import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerPriorityToMenuItems1710000000012
  implements MigrationInterface
{
  name = 'AddSellerPriorityToMenuItems1710000000012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE menu_items
      ADD COLUMN seller_priority INTEGER NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE menu_items
      DROP COLUMN IF EXISTS seller_priority
    `);
  }
}
