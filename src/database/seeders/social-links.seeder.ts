import { DataSource } from 'typeorm';

const socialLinks = [
  {
    name: 'Instagram',
    icon: '/assets/icons/social/instagram.svg',
    url: 'https://www.instagram.com/',
    translations: {
      en: {
        name: 'Instagram',
      },
      ar: {
        name: 'إنستغرام',
      },
    },
  },
  {
    name: 'Facebook',
    icon: '/assets/icons/social/facebook.svg',
    url: 'https://www.facebook.com/',
    translations: {
      en: {
        name: 'Facebook',
      },
      ar: {
        name: 'فيسبوك',
      },
    },
  },
  {
    name: 'X (Twitter)',
    icon: '/assets/icons/social/x.svg',
    url: 'https://x.com/',
    translations: {
      en: {
        name: 'X (Twitter)',
      },
      ar: {
        name: 'إكس (تويتر)',
      },
    },
  },
  {
    name: 'TikTok',
    icon: '/assets/icons/social/tiktok.svg',
    url: 'https://www.tiktok.com/',
    translations: {
      en: {
        name: 'TikTok',
      },
      ar: {
        name: 'تيك توك',
      },
    },
  },
  {
    name: 'Snapchat',
    icon: '/assets/icons/social/snapchat.svg',
    url: 'https://www.snapchat.com/',
    translations: {
      en: {
        name: 'Snapchat',
      },
      ar: {
        name: 'سناب شات',
      },
    },
  },
  {
    name: 'LinkedIn',
    icon: '/assets/icons/social/linkedin.svg',
    url: 'https://www.linkedin.com/',
    translations: {
      en: {
        name: 'LinkedIn',
      },
      ar: {
        name: 'لينكدإن',
      },
    },
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
  for (const item of socialLinks) {
    const existingRows = await dataSource.query(
      `
      SELECT id
      FROM social_links
      WHERE name = $1
      LIMIT 1
      `,
      [item.name],
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
          name,
          icon,
          url,
          is_active
        )
        VALUES ($1, $2, $3, true)
        RETURNING id
        `,
        [item.name, item.icon, item.url],
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

  console.log('Social links seeded successfully');
}