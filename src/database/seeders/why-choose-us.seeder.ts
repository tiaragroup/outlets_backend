import { DataSource } from 'typeorm';

const whyChooseUsSections = [
  {
    moduleSlug: 'flower-scent',
    slug: 'why-choose-us',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'The Flower Scent Promise',
        title: 'Why Choose Flower Scent',
        description: '',
      },
      ar: {
        eyebrow: 'وعد فلاور سنت',
        title: 'لماذا تختار فلاور سنت',
        description: '',
      },
    },
    features: [
      {
        slug: 'fresh-daily-flowers',
        icon: 'flower',
        priority: 1,
        translations: {
          en: {
            title: 'Fresh Daily Flowers',
            description: 'Cut each morning from trusted local growers.',
          },
          ar: {
            title: 'زهور طازجة يومياً',
            description: 'تُقطف كل صباح من مزارعين محليين موثوقين.',
          },
        },
      },
      {
        slug: 'same-day-delivery',
        icon: 'delivery',
        priority: 2,
        translations: {
          en: {
            title: 'Same-Day Delivery',
            description: 'Order by 2pm; delivered by hand before dusk.',
          },
          ar: {
            title: 'توصيل في نفس اليوم',
            description: 'اطلب قبل الساعة 2 ظهراً؛ ويُسلّم يدوياً قبل الغروب.',
          },
        },
      },
      {
        slug: 'secure-payment',
        icon: 'shield',
        priority: 3,
        translations: {
          en: {
            title: 'Secure Payment',
            description: 'Encrypted checkout — Mada, cards & Apple Pay.',
          },
          ar: {
            title: 'دفع آمن',
            description: 'دفع مشفّر — مدى والبطاقات وآبل باي.',
          },
        },
      },
      {
        slug: 'handmade-bouquets',
        icon: 'bouquet',
        priority: 4,
        translations: {
          en: {
            title: 'Handmade Bouquets',
            description: 'Composed stem by stem by our florists.',
          },
          ar: {
            title: 'باقات مصنوعة يدوياً',
            description: 'تُنسّق ساقاً بساق على يد منسّقي الزهور لدينا.',
          },
        },
      },
      {
        slug: 'premium-quality',
        icon: 'diamond',
        priority: 5,
        translations: {
          en: {
            title: 'Premium Quality',
            description: 'A 7-day freshness guarantee on every stem.',
          },
          ar: {
            title: 'جودة فاخرة',
            description: 'ضمان نضارة لمدة 7 أيام على كل ساق.',
          },
        },
      },
    ],
  },
  {
    moduleSlug: 'bakers-bakery',
    slug: 'why-choose-us',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'The Bakers Bakery Promise',
        title: 'Why Choose Bakers Bakery',
        description: '',
      },
      ar: {
        eyebrow: 'وعد بيكرز بيكري',
        title: 'لماذا تختار بيكرز بيكري',
        description: '',
      },
    },
    features: [
      {
        slug: 'baked-fresh-daily',
        icon: 'bread',
        priority: 1,
        translations: {
          en: {
            title: 'Baked Fresh Daily',
            description: 'Out of the oven every morning, never from yesterday.',
          },
          ar: {
            title: 'مخبوز طازجاً يومياً',
            description:
              'يخرج من الفرن كل صباح، ولا نقدّم مخبوزات الأمس أبداً.',
          },
        },
      },
      {
        slug: 'same-day-delivery',
        icon: 'delivery',
        priority: 2,
        translations: {
          en: {
            title: 'Same-Day Delivery',
            description: 'Order by 2pm; delivered fresh before dusk.',
          },
          ar: {
            title: 'توصيل في نفس اليوم',
            description: 'اطلب قبل الساعة 2 ظهراً؛ ويُسلّم طازجاً قبل الغروب.',
          },
        },
      },
      {
        slug: 'secure-payment',
        icon: 'shield',
        priority: 3,
        translations: {
          en: {
            title: 'Secure Payment',
            description: 'Encrypted checkout — Mada, cards & Apple Pay.',
          },
          ar: {
            title: 'دفع آمن',
            description: 'دفع مشفّر — مدى والبطاقات وآبل باي.',
          },
        },
      },
      {
        slug: 'handmade-recipes',
        icon: 'handmade',
        priority: 4,
        translations: {
          en: {
            title: 'Handmade Recipes',
            description: 'Shaped and finished by hand in our own kitchen.',
          },
          ar: {
            title: 'وصفات مصنوعة يدوياً',
            description: 'تُشكّل وتُنهى يدوياً في مطبخنا الخاص.',
          },
        },
      },
      {
        slug: 'premium-ingredients',
        icon: 'diamond',
        priority: 5,
        translations: {
          en: {
            title: 'Premium Ingredients',
            description: 'Stone-milled flour and real butter, always.',
          },
          ar: {
            title: 'مكوّنات فاخرة',
            description: 'دقيق مطحون بالحجر وزبدة حقيقية، دائماً.',
          },
        },
      },
    ],
  },
  {
    moduleSlug: 'elements-du-chocolate',
    slug: 'why-choose-us',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'The Elements Promise',
        title: 'Why Choose Elements du Chocolate',
        description: '',
      },
      ar: {
        eyebrow: 'وعد إليمنتس',
        title: 'لماذا تختار إليمنتس دو شوكولا',
        description: '',
      },
    },
    features: [
      {
        slug: 'single-origin-cocoa',
        icon: 'cocoa',
        priority: 1,
        translations: {
          en: {
            title: 'Single-Origin Cocoa',
            description: 'Beans traced back to a single estate, every batch.',
          },
          ar: {
            title: 'كاكاو أحادي المنشأ',
            description: 'حبوب تعود إلى مزرعة واحدة، في كل دفعة.',
          },
        },
      },
      {
        slug: 'same-day-delivery',
        icon: 'delivery',
        priority: 2,
        translations: {
          en: {
            title: 'Same-Day Delivery',
            description: 'Order by 2pm; delivered chilled before dusk.',
          },
          ar: {
            title: 'توصيل في نفس اليوم',
            description: 'اطلب قبل الساعة 2 ظهراً؛ ويُسلّم مبرّداً قبل الغروب.',
          },
        },
      },
      {
        slug: 'secure-payment',
        icon: 'shield',
        priority: 3,
        translations: {
          en: {
            title: 'Secure Payment',
            description: 'Encrypted checkout — Mada, cards & Apple Pay.',
          },
          ar: {
            title: 'دفع آمن',
            description: 'دفع مشفّر — مدى والبطاقات وآبل باي.',
          },
        },
      },
      {
        slug: 'handmade-pralines',
        icon: 'handmade',
        priority: 4,
        translations: {
          en: {
            title: 'Handmade Pralines',
            description: 'Tempered in small batches and filled by hand.',
          },
          ar: {
            title: 'برالين مصنوع يدوياً',
            description: 'يُقسّى على دفعات صغيرة ويُحشى يدوياً.',
          },
        },
      },
      {
        slug: 'premium-quality',
        icon: 'diamond',
        priority: 5,
        translations: {
          en: {
            title: 'Premium Quality',
            description: 'Assembled to order, never left sitting on a shelf.',
          },
          ar: {
            title: 'جودة فاخرة',
            description: 'يُجهّز عند الطلب، ولا يُترك على الرفوف أبداً.',
          },
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

export async function seedWhyChooseUs(dataSource: DataSource) {
  for (const whyChooseUsSection of whyChooseUsSections) {
    const moduleRows = await dataSource.query(
      `
      SELECT id
      FROM modules
      WHERE slug = $1
      LIMIT 1
      `,
      [whyChooseUsSection.moduleSlug],
    );

    if (!moduleRows.length) {
      console.warn(
        `Module not found for why choose us section: ${whyChooseUsSection.moduleSlug}`,
      );
      continue;
    }

    const moduleId = Number(moduleRows[0].id);

    const existingRows = await dataSource.query(
      `
      SELECT id
      FROM module_why_choose_us_sections
      WHERE module_id = $1
      AND slug = $2
      LIMIT 1
      `,
      [moduleId, whyChooseUsSection.slug],
    );

    let whyChooseUsSectionId: number;

    if (existingRows.length) {
      whyChooseUsSectionId = Number(existingRows[0].id);

      await dataSource.query(
        `
        UPDATE module_why_choose_us_sections
        SET
          priority = $1,
          is_active = true,
          updated_at = now()
        WHERE id = $2
        `,
        [whyChooseUsSection.priority, whyChooseUsSectionId],
      );
    } else {
      const insertedRows = await dataSource.query(
        `
        INSERT INTO module_why_choose_us_sections (
          module_id,
          slug,
          priority,
          is_active
        )
        VALUES ($1, $2, $3, true)
        RETURNING id
        `,
        [moduleId, whyChooseUsSection.slug, whyChooseUsSection.priority],
      );

      whyChooseUsSectionId = Number(insertedRows[0].id);
    }

    await upsertTranslationSet(
      dataSource,
      'module_why_choose_us_section',
      whyChooseUsSectionId,
      whyChooseUsSection.translations,
    );

    for (const feature of whyChooseUsSection.features) {
      const existingFeatureRows = await dataSource.query(
        `
        SELECT id
        FROM module_why_choose_us_features
        WHERE why_choose_us_section_id = $1
        AND slug = $2
        LIMIT 1
        `,
        [whyChooseUsSectionId, feature.slug],
      );

      let featureId: number;

      if (existingFeatureRows.length) {
        featureId = Number(existingFeatureRows[0].id);

        await dataSource.query(
          `
          UPDATE module_why_choose_us_features
          SET
            icon = $1,
            priority = $2,
            is_active = true,
            updated_at = now()
          WHERE id = $3
          `,
          [feature.icon, feature.priority, featureId],
        );
      } else {
        const insertedFeatureRows = await dataSource.query(
          `
          INSERT INTO module_why_choose_us_features (
            why_choose_us_section_id,
            slug,
            icon,
            priority,
            is_active
          )
          VALUES ($1, $2, $3, $4, true)
          RETURNING id
          `,
          [whyChooseUsSectionId, feature.slug, feature.icon, feature.priority],
        );

        featureId = Number(insertedFeatureRows[0].id);
      }

      await upsertTranslationSet(
        dataSource,
        'module_why_choose_us_feature',
        featureId,
        feature.translations,
      );
    }
  }

  console.log('Module why choose us sections seeded successfully');
}
