import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSocialLinks1710000000002 implements MigrationInterface {
  name = 'CreateSocialLinks1710000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE social_links (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(255),
        url VARCHAR(500) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_social_links_is_active ON social_links(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS social_links;`);
  }
}