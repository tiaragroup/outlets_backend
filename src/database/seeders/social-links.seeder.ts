import { DataSource } from 'typeorm';

const modulesSocialLinks = [
  {
    moduleSlug: 'bakers-bakery',
    links: [
      {
        name: 'Instagram',
        icon: '/assets/icons/social/instagram.svg',
        url: 'https://www.instagram.com/bakersbakery',
        translations: {
          en: { name: 'Instagram' },
          ar: { name: 'إنستغرام' },
        },
      },
      {
        name: 'Facebook',
        icon: '/assets/icons/social/facebook.svg',
        url: 'https://www.facebook.com/bakersbakery',
        translations: {
          en: { name: 'Facebook' },
          ar: { name: 'فيسبوك' },
        },
      },
      {
        name: 'X (Twitter)',
        icon: '/assets/icons/social/x.svg',
        url: 'https://x.com/bakersbakery',
        translations: {
          en: { name: 'X (Twitter)' },
          ar: { name: 'إكس (تويتر)' },
        },
      },
      {
        name: 'TikTok',
        icon: '/assets/icons/social/tiktok.svg',
        url: 'https://www.tiktok.com/@bakersbakery',
        translations: {
          en: { name: 'TikTok' },
          ar: { name: 'تيك توك' },
        },
      },
      {
        name: 'Snapchat',
        icon: '/assets/icons/social/snapchat.svg',
        url: 'https://www.snapchat.com/add/bakersbakery',
        translations: {
          en: { name: 'Snapchat' },
          ar: { name: 'سناب شات' },
        },
      },
      {
        name: 'LinkedIn',
        icon: '/assets/icons/social/linkedin.svg',
        url: 'https://www.linkedin.com/company/bakersbakery',
        translations: {
          en: { name: 'LinkedIn' },
          ar: { name: 'لينكدإن' },
        },
      },
    ],
  },
  {
    moduleSlug: 'elements-du-chocolate',
    links: [
      {
        name: 'Instagram',
        icon: '/assets/icons/social/instagram.svg',
        url: 'https://www.instagram.com/elementsduchocolate',
        translations: {
          en: { name: 'Instagram' },
          ar: { name: 'إنستغرام' },
        },
      },
      {
        name: 'Facebook',
        icon: '/assets/icons/social/facebook.svg',
        url: 'https://www.facebook.com/elementsduchocolate',
        translations: {
          en: { name: 'Facebook' },
          ar: { name: 'فيسبوك' },
        },
      },
      {
        name: 'X (Twitter)',
        icon: '/assets/icons/social/x.svg',
        url: 'https://x.com/elementsduchoc',
        translations: {
          en: { name: 'X (Twitter)' },
          ar: { name: 'إكس (تويتر)' },
        },
      },
      {
        name: 'TikTok',
        icon: '/assets/icons/social/tiktok.svg',
        url: 'https://www.tiktok.com/@elementsduchocolate',
        translations: {
          en: { name: 'TikTok' },
          ar: { name: 'تيك توك' },
        },
      },
      {
        name: 'Snapchat',
        icon: '/assets/icons/social/snapchat.svg',
        url: 'https://www.snapchat.com/add/elementsduchocolate',
        translations: {
          en: { name: 'Snapchat' },
          ar: { name: 'سناب شات' },
        },
      },
      {
        name: 'LinkedIn',
        icon: '/assets/icons/social/linkedin.svg',
        url: 'https://www.linkedin.com/company/elementsduchocolate',
        translations: {
          en: { name: 'LinkedIn' },
          ar: { name: 'لينكدإن' },
        },
      },
    ],
  },
  {
    moduleSlug: 'flower-scent',
    links: [
      {
        name: 'Instagram',
        icon: '/assets/icons/social/instagram.svg',
        url: 'https://www.instagram.com/flowerscent',
        translations: {
          en: { name: 'Instagram' },
          ar: { name: 'إنستغرام' },
        },
      },
      {
        name: 'Facebook',
        icon: '/assets/icons/social/facebook.svg',
        url: 'https://www.facebook.com/flowerscent',
        translations: {
          en: { name: 'Facebook' },
          ar: { name: 'فيسبوك' },
        },
      },
      {
        name: 'X (Twitter)',
        icon: '/assets/icons/social/x.svg',
        url: 'https://x.com/flowerscent',
        translations: {
          en: { name: 'X (Twitter)' },
          ar: { name: 'إكس (تويتر)' },
        },
      },
      {
        name: 'TikTok',
        icon: '/assets/icons/social/tiktok.svg',
        url: 'https://www.tiktok.com/@flowerscent',
        translations: {
          en: { name: 'TikTok' },
          ar: { name: 'تيك توك' },
        },
      },
      {
        name: 'Snapchat',
        icon: '/assets/icons/social/snapchat.svg',
        url: 'https://www.snapchat.com/add/flowerscent',
        translations: {
          en: { name: 'Snapchat' },
          ar: { name: 'سناب شات' },
        },
      },
      {
        name: 'LinkedIn',
        icon: '/assets/icons/social/linkedin.svg',
        url: 'https://www.linkedin.com/company/flowerscent',
        translations: {
          en: { name: 'LinkedIn' },
          ar: { name: 'لينكدإن' },
        },
      },
    ],
  },
];

async function upsertTranslation(
  dataSource: DataSource,
  modelType: string,
  modelId: number,
  fieldName: string,
  fieldValue?: string | null,
  langCode = 'en',
) {
  if (fieldValue === undefined || fieldValue === null) {
    return;
  }

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
    [modelType, modelId, langCode, fieldName, fieldValue],
  );
}

export async function seedSocialLinks(dataSource: DataSource) {
  /**
   * Disable old global social links that have no module.
   */
  await dataSource.query(`
    UPDATE social_links
    SET is_active = false,
        updated_at = now()
    WHERE module_id IS NULL
  `);

  for (const moduleSocial of modulesSocialLinks) {
    const moduleRows = await dataSource.query(
      `
      SELECT id
      FROM modules
      WHERE slug = $1
      LIMIT 1
      `,
      [moduleSocial.moduleSlug],
    );

    if (!moduleRows.length) {
      console.warn(`Module not found for social links: ${moduleSocial.moduleSlug}`);
      continue;
    }

    const moduleId = Number(moduleRows[0].id);

    for (const item of moduleSocial.links) {
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
          await upsertTranslation(
            dataSource,
            'social_link',
            socialLinkId,
            fieldName,
            fields[fieldName],
            langCode,
          );
        }
      }
    }
  }

  console.log('Module-specific social links seeded successfully');
}