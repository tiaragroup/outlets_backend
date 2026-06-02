import { DataSource } from 'typeorm';

const legalContents = [
  {
    moduleSlug: 'bakers-bakery',
    contentType: 'privacy_policy',
    slug: 'privacy-policy',
    translations: {
      en: {
        title: 'Privacy Policy',
        content:
          '<p>This Privacy Policy explains how Bakers Bakery collects, uses, and protects customer information.</p>',
      },
      ar: {
        title: 'سياسة الخصوصية',
        content:
          '<p>توضح سياسة الخصوصية هذه كيفية جمع بيكرز بيكري لمعلومات العملاء واستخدامها وحمايتها.</p>',
      },
    },
  },
  {
    moduleSlug: 'bakers-bakery',
    contentType: 'terms_of_service',
    slug: 'terms-of-service',
    translations: {
      en: {
        title: 'Terms of Service',
        content:
          '<p>These Terms of Service govern your use of Bakers Bakery services and ordering platforms.</p>',
      },
      ar: {
        title: 'شروط الخدمة',
        content:
          '<p>تحكم شروط الخدمة هذه استخدامك لخدمات بيكرز بيكري ومنصات الطلب.</p>',
      },
    },
  },
  {
    moduleSlug: 'elements-du-chocolate',
    contentType: 'privacy_policy',
    slug: 'privacy-policy',
    translations: {
      en: {
        title: 'Privacy Policy',
        content:
          '<p>This Privacy Policy explains how Elements Du Chocolat collects, uses, and protects customer information.</p>',
      },
      ar: {
        title: 'سياسة الخصوصية',
        content:
          '<p>توضح سياسة الخصوصية هذه كيفية جمع إليمنتس دو شوكولا لمعلومات العملاء واستخدامها وحمايتها.</p>',
      },
    },
  },
  {
    moduleSlug: 'elements-du-chocolate',
    contentType: 'terms_of_service',
    slug: 'terms-of-service',
    translations: {
      en: {
        title: 'Terms of Service',
        content:
          '<p>These Terms of Service govern your use of Elements Du Chocolat services and ordering platforms.</p>',
      },
      ar: {
        title: 'شروط الخدمة',
        content:
          '<p>تحكم شروط الخدمة هذه استخدامك لخدمات إليمنتس دو شوكولا ومنصات الطلب.</p>',
      },
    },
  },
  {
    moduleSlug: 'flower-scent',
    contentType: 'privacy_policy',
    slug: 'privacy-policy',
    translations: {
      en: {
        title: 'Privacy Policy',
        content:
          '<p>This Privacy Policy explains how Flower Scent collects, uses, and protects customer information.</p>',
      },
      ar: {
        title: 'سياسة الخصوصية',
        content:
          '<p>توضح سياسة الخصوصية هذه كيفية جمع فلاور سنت لمعلومات العملاء واستخدامها وحمايتها.</p>',
      },
    },
  },
  {
    moduleSlug: 'flower-scent',
    contentType: 'terms_of_service',
    slug: 'terms-of-service',
    translations: {
      en: {
        title: 'Terms of Service',
        content:
          '<p>These Terms of Service govern your use of Flower Scent services and ordering platforms.</p>',
      },
      ar: {
        title: 'شروط الخدمة',
        content:
          '<p>تحكم شروط الخدمة هذه استخدامك لخدمات فلاور سنت ومنصات الطلب.</p>',
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
  if (fieldValue === undefined || fieldValue === null) return;

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

export async function seedLegalContents(dataSource: DataSource) {
  for (const item of legalContents) {
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
      console.warn(`Module not found for legal content: ${item.moduleSlug}`);
      continue;
    }

    const moduleId = Number(moduleRows[0].id);

    const existingRows = await dataSource.query(
      `
      SELECT id
      FROM module_legal_contents
      WHERE module_id = $1
      AND content_type = $2
      LIMIT 1
      `,
      [moduleId, item.contentType],
    );

    let legalContentId: number;

    if (existingRows.length) {
      legalContentId = Number(existingRows[0].id);

      await dataSource.query(
        `
        UPDATE module_legal_contents
        SET
          slug = $1,
          is_active = true,
          updated_at = now()
        WHERE id = $2
        `,
        [item.slug, legalContentId],
      );
    } else {
      const insertedRows = await dataSource.query(
        `
        INSERT INTO module_legal_contents (
          module_id,
          content_type,
          slug,
          is_active
        )
        VALUES ($1, $2, $3, true)
        RETURNING id
        `,
        [moduleId, item.contentType, item.slug],
      );

      legalContentId = Number(insertedRows[0].id);
    }

    for (const langCode of Object.keys(item.translations)) {
      const fields = item.translations[langCode];

      for (const fieldName of Object.keys(fields)) {
        await upsertTranslation(
          dataSource,
          'module_legal_content',
          legalContentId,
          fieldName,
          fields[fieldName],
          langCode,
        );
      }
    }
  }

  console.log('Legal contents seeded successfully');
}