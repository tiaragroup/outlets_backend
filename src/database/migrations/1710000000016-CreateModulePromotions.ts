import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModulePromotions1710000000016 implements MigrationInterface {
  name = 'CreateModulePromotions1710000000016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE module_promotions (
        id BIGSERIAL PRIMARY KEY,

        module_id BIGINT NOT NULL,

        slug VARCHAR(150) NOT NULL,

        background_image VARCHAR(1000),
        mobile_background_image VARCHAR(1000),

        button_url VARCHAR(1000),

        starts_at TIMESTAMPTZ,
        ends_at TIMESTAMPTZ,

        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_module_promotions_module
          FOREIGN KEY (module_id)
          REFERENCES modules(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_module_promotion_slug
          UNIQUE (module_id, slug)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_promotions_module_id
      ON module_promotions(module_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_promotions_is_active
      ON module_promotions(is_active);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_module_promotions_schedule
      ON module_promotions(starts_at, ends_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS module_promotions;`);
  }
}
