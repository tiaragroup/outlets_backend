import { DataSource } from 'typeorm';

const storySections = [
  {
    moduleSlug: 'flower-scent',
    slug: 'our-story',
    image: '/assets/images/story/flower-scent-story.jpg',
    mobileImage: '/assets/images/story/flower-scent-story-mobile.jpg',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'Our Story',
        title: 'An Atelier Born from a Garden',
        description:
          'Flower Scent began in 2018 as a small Riyadh atelier with one belief: flowers should arrive as fresh as the moment they were cut. Every morning we select stems from trusted local growers, and every bouquet is composed by hand — never pre-made.',
        secondary_description:
          'Today we deliver across the city the same day, style weddings and events, and still wrap every order in linen paper, by hand, the way we did on day one.',
        image_alt: 'White lilies arranged in a dark vase',
        image_credit: 'Photo by Jerry Wang on Unsplash',
      },
      ar: {
        eyebrow: 'قصتنا',
        title: 'أتيليه وُلد من حديقة',
        description:
          'بدأت فلاور سنت عام 2018 كأتيليه صغير في الرياض بإيمان واحد: يجب أن تصل الزهور طازجة كلحظة قطفها. كل صباح نختار السيقان من مزارعين محليين موثوقين، وتُنسّق كل باقة يدوياً — ولا تُحضّر مسبقاً أبداً.',
        secondary_description:
          'واليوم نوصل في جميع أنحاء المدينة في نفس اليوم، وننسّق حفلات الزفاف والمناسبات، وما زلنا نغلّف كل طلب بورق الكتان يدوياً، تماماً كما فعلنا في يومنا الأول.',
        image_alt: 'زنابق بيضاء منسقة في مزهرية داكنة',
        image_credit: 'تصوير جيري وانغ على أنسبلاش',
      },
    },
    stats: [
      {
        slug: 'founded',
        icon: null,
        priority: 1,
        translations: {
          en: { value: '2018', label: 'Founded in Riyadh' },
          ar: { value: '2018', label: 'تأسست في الرياض' },
        },
      },
      {
        slug: 'bouquets-delivered',
        icon: null,
        priority: 2,
        translations: {
          en: { value: '12,000+', label: 'Bouquets delivered' },
          ar: { value: '+12,000', label: 'باقة تم توصيلها' },
        },
      },
      {
        slug: 'average-rating',
        icon: 'star',
        priority: 3,
        translations: {
          en: { value: '4.9', label: 'Average rating' },
          ar: { value: '4.9', label: 'متوسط التقييم' },
        },
      },
    ],
  },
  {
    moduleSlug: 'bakers-bakery',
    slug: 'our-story',
    image: '/assets/images/story/bakers-bakery-story.jpg',
    mobileImage: '/assets/images/story/bakers-bakery-story-mobile.jpg',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'Our Story',
        title: 'Baked Fresh Since Day One',
        description:
          'Bakers Bakery started with a single stone oven and a simple promise: bake everything fresh, every morning. We mill our own blends, proof our dough slowly, and never keep yesterday on the shelf.',
        secondary_description:
          'From daily breads to custom celebration cakes, every piece leaves our kitchen the same day it is made — handmade, and finished with care.',
        image_alt: 'Freshly baked bread on a wooden counter',
        image_credit: '',
      },
      ar: {
        eyebrow: 'قصتنا',
        title: 'مخبوزات طازجة منذ اليوم الأول',
        description:
          'بدأت بيكرز بيكري بفرن حجري واحد ووعد بسيط: أن نخبز كل شيء طازجاً كل صباح. نطحن خلطاتنا بأنفسنا، ونخمّر العجين ببطء، ولا نحتفظ بمخبوزات الأمس على الرفوف أبداً.',
        secondary_description:
          'من الخبز اليومي إلى كيك المناسبات المخصص، تغادر كل قطعة مطبخنا في اليوم نفسه الذي صُنعت فيه — مصنوعة يدوياً وبعناية.',
        image_alt: 'خبز طازج على طاولة خشبية',
        image_credit: '',
      },
    },
    stats: [
      {
        slug: 'founded',
        icon: null,
        priority: 1,
        translations: {
          en: { value: '2015', label: 'Baking since' },
          ar: { value: '2015', label: 'نخبز منذ' },
        },
      },
      {
        slug: 'orders-delivered',
        icon: null,
        priority: 2,
        translations: {
          en: { value: '30,000+', label: 'Orders delivered' },
          ar: { value: '+30,000', label: 'طلب تم توصيله' },
        },
      },
      {
        slug: 'average-rating',
        icon: 'star',
        priority: 3,
        translations: {
          en: { value: '4.8', label: 'Average rating' },
          ar: { value: '4.8', label: 'متوسط التقييم' },
        },
      },
    ],
  },
  {
    moduleSlug: 'elements-du-chocolate',
    slug: 'our-story',
    image: '/assets/images/story/elements-du-chocolate-story.jpg',
    mobileImage:
      '/assets/images/story/elements-du-chocolate-story-mobile.jpg',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'Our Story',
        title: 'A Maison Built on Single-Origin Cocoa',
        description:
          'Elements du Chocolate was founded by chocolatiers who wanted to bring true single-origin cocoa to Riyadh. We temper in small batches, fill by hand, and let the beans speak for themselves.',
        secondary_description:
          'Every box is assembled to order and finished with a hand-tied ribbon — the same way our very first gift box left the atelier.',
        image_alt: 'Assorted handmade chocolates in a gift box',
        image_credit: '',
      },
      ar: {
        eyebrow: 'قصتنا',
        title: 'ميزون بُني على كاكاو أحادي المنشأ',
        description:
          'تأسست إليمنتس دو شوكولا على يد صنّاع شوكولاتة أرادوا تقديم الكاكاو أحادي المنشأ الحقيقي في الرياض. نقوم بالتقسية على دفعات صغيرة، ونحشو يدوياً، وندع حبوب الكاكاو تتحدث عن نفسها.',
        secondary_description:
          'يُجهّز كل صندوق عند الطلب ويُزيّن بشريط معقود يدوياً — تماماً كما غادر أول صندوق هدايا لنا الأتيليه.',
        image_alt: 'تشكيلة شوكولاتة مصنوعة يدوياً في صندوق هدايا',
        image_credit: '',
      },
    },
    stats: [
      {
        slug: 'founded',
        icon: null,
        priority: 1,
        translations: {
          en: { value: '2019', label: 'Crafting since' },
          ar: { value: '2019', label: 'نصنع منذ' },
        },
      },
      {
        slug: 'boxes-gifted',
        icon: null,
        priority: 2,
        translations: {
          en: { value: '8,000+', label: 'Gift boxes crafted' },
          ar: { value: '+8,000', label: 'صندوق هدايا تم صنعه' },
        },
      },
      {
        slug: 'average-rating',
        icon: 'star',
        priority: 3,
        translations: {
          en: { value: '4.9', label: 'Average rating' },
          ar: { value: '4.9', label: 'متوسط التقييم' },
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

export async function seedStorySections(dataSource: DataSource) {
  for (const storySection of storySections) {
    const moduleRows = await dataSource.query(
      `
      SELECT id
      FROM modules
      WHERE slug = $1
      LIMIT 1
      `,
      [storySection.moduleSlug],
    );

    if (!moduleRows.length) {
      console.warn(
        `Module not found for story section: ${storySection.moduleSlug}`,
      );
      continue;
    }

    const moduleId = Number(moduleRows[0].id);

    const existingRows = await dataSource.query(
      `
      SELECT id
      FROM module_story_sections
      WHERE module_id = $1
      AND slug = $2
      LIMIT 1
      `,
      [moduleId, storySection.slug],
    );

    let storySectionId: number;

    if (existingRows.length) {
      storySectionId = Number(existingRows[0].id);

      await dataSource.query(
        `
        UPDATE module_story_sections
        SET
          image = $1,
          mobile_image = $2,
          priority = $3,
          is_active = true,
          updated_at = now()
        WHERE id = $4
        `,
        [
          storySection.image,
          storySection.mobileImage,
          storySection.priority,
          storySectionId,
        ],
      );
    } else {
      const insertedRows = await dataSource.query(
        `
        INSERT INTO module_story_sections (
          module_id,
          slug,
          image,
          mobile_image,
          priority,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING id
        `,
        [
          moduleId,
          storySection.slug,
          storySection.image,
          storySection.mobileImage,
          storySection.priority,
        ],
      );

      storySectionId = Number(insertedRows[0].id);
    }

    await upsertTranslationSet(
      dataSource,
      'module_story_section',
      storySectionId,
      storySection.translations,
    );

    for (const stat of storySection.stats) {
      const existingStatRows = await dataSource.query(
        `
        SELECT id
        FROM module_story_stats
        WHERE story_section_id = $1
        AND slug = $2
        LIMIT 1
        `,
        [storySectionId, stat.slug],
      );

      let statId: number;

      if (existingStatRows.length) {
        statId = Number(existingStatRows[0].id);

        await dataSource.query(
          `
          UPDATE module_story_stats
          SET
            icon = $1,
            priority = $2,
            is_active = true,
            updated_at = now()
          WHERE id = $3
          `,
          [stat.icon, stat.priority, statId],
        );
      } else {
        const insertedStatRows = await dataSource.query(
          `
          INSERT INTO module_story_stats (
            story_section_id,
            slug,
            icon,
            priority,
            is_active
          )
          VALUES ($1, $2, $3, $4, true)
          RETURNING id
          `,
          [storySectionId, stat.slug, stat.icon, stat.priority],
        );

        statId = Number(insertedStatRows[0].id);
      }

      await upsertTranslationSet(
        dataSource,
        'module_story_stat',
        statId,
        stat.translations,
      );
    }
  }

  console.log('Module story sections seeded successfully');
}
