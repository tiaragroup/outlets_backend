import { DataSource } from 'typeorm';

const promotions = [
  {
    moduleSlug: 'flower-scent',
    slug: 'summer-garden-edit',
    backgroundImage: '/assets/images/promotions/flower-scent-summer.jpg',
    mobileBackgroundImage:
      '/assets/images/promotions/flower-scent-summer-mobile.jpg',
    buttonUrl: '/collections/summer-garden',
    startsAt: '2026-06-01T00:00:00Z',
    endsAt: '2026-08-31T23:59:59Z',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'Limited Season · Ends Aug 31',
        title: 'The Summer Garden Edit',
        description:
          'Peonies, garden roses and sweet peas — gathered at their peak, arranged for golden evenings.',
        button_label: 'Explore the Collection',
        image_alt: 'Close-up of pink peony petals',
        image_credit: 'Photo by Dina Makhmutova on Unsplash',
      },
      ar: {
        eyebrow: 'موسم محدود · ينتهي 31 أغسطس',
        title: 'تشكيلة حديقة الصيف',
        description:
          'الفاوانيا وورود الحديقة والبازلاء الحلوة — تُقطف في ذروتها، وتُنسّق لأمسيات ذهبية.',
        button_label: 'اكتشف التشكيلة',
        image_alt: 'لقطة قريبة لبتلات الفاوانيا الوردية',
        image_credit: 'تصوير دينا مخموتوفا على أنسبلاش',
      },
    },
  },
  {
    moduleSlug: 'bakers-bakery',
    slug: 'weekend-bake-box',
    backgroundImage: '/assets/images/promotions/bakers-bakery-weekend.jpg',
    mobileBackgroundImage:
      '/assets/images/promotions/bakers-bakery-weekend-mobile.jpg',
    buttonUrl: '/collections/weekend-bake-box',
    startsAt: null,
    endsAt: null,
    priority: 1,
    translations: {
      en: {
        eyebrow: 'Weekends Only · Fri & Sat',
        title: 'The Weekend Bake Box',
        description:
          'Sourdough, butter croissants and cinnamon buns — baked at dawn and boxed for the table.',
        button_label: 'Order the Box',
        image_alt: 'Assorted pastries in a bakery box',
        image_credit: '',
      },
      ar: {
        eyebrow: 'نهاية الأسبوع فقط · الجمعة والسبت',
        title: 'صندوق مخبوزات نهاية الأسبوع',
        description:
          'خبز العجين المخمّر وكرواسون الزبدة ولفائف القرفة — تُخبز عند الفجر وتُعبأ للمائدة.',
        button_label: 'اطلب الصندوق',
        image_alt: 'تشكيلة معجنات في صندوق مخبوزات',
        image_credit: '',
      },
    },
  },
  {
    moduleSlug: 'elements-du-chocolate',
    slug: 'single-origin-discovery',
    backgroundImage: '/assets/images/promotions/elements-discovery.jpg',
    mobileBackgroundImage:
      '/assets/images/promotions/elements-discovery-mobile.jpg',
    buttonUrl: '/collections/single-origin-discovery',
    startsAt: null,
    endsAt: null,
    priority: 1,
    translations: {
      en: {
        eyebrow: 'New Release · Limited Batch',
        title: 'The Single-Origin Discovery Box',
        description:
          'Six estates, six flavours — tempered in small batches and boxed with a tasting card.',
        button_label: 'Discover the Box',
        image_alt: 'Single-origin chocolate bars arranged in a row',
        image_credit: '',
      },
      ar: {
        eyebrow: 'إصدار جديد · دفعة محدودة',
        title: 'صندوق اكتشاف الكاكاو أحادي المنشأ',
        description:
          'ست مزارع، وستة نكهات — تُقسّى على دفعات صغيرة وتُعبأ مع بطاقة تذوق.',
        button_label: 'اكتشف الصندوق',
        image_alt: 'ألواح شوكولاتة أحادية المنشأ مرتبة في صف',
        image_credit: '',
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

async function upsertTranslationSet(
  dataSource: DataSource,
  modelType: string,
  modelId: number,
  translations: Record<string, Record<string, string>>,
) {
  for (const langCode of Object.keys(translations)) {
    const fields = translations[langCode];

    for (const fieldName of Object.keys(fields)) {
      await upsertTranslation(
        dataSource,
        modelType,
        modelId,
        fieldName,
        fields[fieldName],
        langCode,
      );
    }
  }
}

export async function seedPromotions(dataSource: DataSource) {
  for (const promotion of promotions) {
    const moduleRows = await dataSource.query(
      `
      SELECT id
      FROM modules
      WHERE slug = $1
      LIMIT 1
      `,
      [promotion.moduleSlug],
    );

    if (!moduleRows.length) {
      console.warn(`Module not found for promotion: ${promotion.moduleSlug}`);
      continue;
    }

    const moduleId = Number(moduleRows[0].id);

    const existingRows = await dataSource.query(
      `
      SELECT id
      FROM module_promotions
      WHERE module_id = $1
      AND slug = $2
      LIMIT 1
      `,
      [moduleId, promotion.slug],
    );

    let promotionId: number;

    if (existingRows.length) {
      promotionId = Number(existingRows[0].id);

      await dataSource.query(
        `
        UPDATE module_promotions
        SET
          background_image = $1,
          mobile_background_image = $2,
          button_url = $3,
          starts_at = $4,
          ends_at = $5,
          priority = $6,
          is_active = true,
          updated_at = now()
        WHERE id = $7
        `,
        [
          promotion.backgroundImage,
          promotion.mobileBackgroundImage,
          promotion.buttonUrl,
          promotion.startsAt,
          promotion.endsAt,
          promotion.priority,
          promotionId,
        ],
      );
    } else {
      const insertedRows = await dataSource.query(
        `
        INSERT INTO module_promotions (
          module_id,
          slug,
          background_image,
          mobile_background_image,
          button_url,
          starts_at,
          ends_at,
          priority,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
        RETURNING id
        `,
        [
          moduleId,
          promotion.slug,
          promotion.backgroundImage,
          promotion.mobileBackgroundImage,
          promotion.buttonUrl,
          promotion.startsAt,
          promotion.endsAt,
          promotion.priority,
        ],
      );

      promotionId = Number(insertedRows[0].id);
    }

    await upsertTranslationSet(
      dataSource,
      'module_promotion',
      promotionId,
      promotion.translations,
    );
  }

  console.log('Module promotions seeded successfully');
}
