import { DataSource } from 'typeorm';

const whatsappLinks = [
  {
    moduleSlug: 'bakers-bakery',
    name: 'WhatsApp',
    icon: '/assets/icons/social/whatsapp.svg',
    url: 'https://wa.me/966920014425',
    translations: {
      en: { name: 'WhatsApp' },
      ar: { name: 'واتساب' },
    },
  },
  {
    moduleSlug: 'elements-du-chocolate',
    name: 'WhatsApp',
    icon: '/assets/icons/social/whatsapp.svg',
    url: 'https://wa.me/966920014426',
    translations: {
      en: { name: 'WhatsApp' },
      ar: { name: 'واتساب' },
    },
  },
  {
    moduleSlug: 'flower-scent',
    name: 'WhatsApp',
    icon: '/assets/icons/social/whatsapp.svg',
    url: 'https://wa.me/966920014427',
    translations: {
      en: { name: 'WhatsApp' },
      ar: { name: 'واتساب' },
    },
  },
];

export class WhatsAppSocialLinksSeeder {
  static async run(dataSource: DataSource) {
    for (const item of whatsappLinks) {
      const moduleRows = await dataSource.query(
        `
        SELECT id
        FROM modules
        WHERE slug = $1
        LIMIT 1
        `,
        [item.moduleSlug],
      );

      if (!moduleRows.length) {
        console.warn(`Module not found for WhatsApp link: ${item.moduleSlug}`);
        continue;
      }

      const moduleId = Number(moduleRows[0].id);

      const existingRows = await dataSource.query(
        `
        SELECT id
        FROM social_links
        WHERE module_id = $1
        AND name = $2
        LIMIT 1
        `,
        [moduleId, item.name],
      );

      let socialLinkId: number;

      if (existingRows.length) {
        socialLinkId = Number(existingRows[0].id);

        await dataSource.query(
          `
          UPDATE social_links
          SET
            icon = $1,
            url = $2,
            is_active = true,
            updated_at = now()
          WHERE id = $3
          `,
          [item.icon, item.url, socialLinkId],
        );
      } else {
        const insertedRows = await dataSource.query(
          `
          INSERT INTO social_links (
            module_id,
            name,
            icon,
            url,
            is_active
          )
          VALUES ($1, $2, $3, $4, true)
          RETURNING id
          `,
          [moduleId, item.name, item.icon, item.url],
        );

        socialLinkId = Number(insertedRows[0].id);
      }

      for (const langCode of Object.keys(item.translations)) {
        const fields = item.translations[langCode];

        for (const fieldName of Object.keys(fields)) {
          await dataSource.query(
            `
            INSERT INTO translations (
              model_type,
              model_id,
              lang_code,
              field_name,
              field_value
            )
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (model_type, model_id, lang_code, field_name)
            DO UPDATE SET
              field_value = EXCLUDED.field_value,
              updated_at = now()
            `,
            [
              'social_link',
              socialLinkId,
              langCode,
              fieldName,
              fields[fieldName],
            ],
          );
        }
      }

      console.log(`WhatsApp social link seeded for ${item.moduleSlug}`);
    }

    console.log('WhatsApp social links seeded successfully');
  }
}