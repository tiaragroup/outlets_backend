import { DataSource } from 'typeorm';

const heroSections = [
  {
    moduleSlug: 'flower-scent',
    slug: 'main-hero',
    backgroundImage: '/assets/images/hero/flower-scent-hero.jpg',
    mobileBackgroundImage: '/assets/images/hero/flower-scent-hero-mobile.jpg',
    primaryButtonUrl: '/menu',
    secondaryButtonUrl: '/build-your-bouquet',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'Fresh · Handcrafted · Same-Day',
        title: 'Flowers That Speak from the Heart',
        description:
          'Fresh bouquets crafted with love and delivered the same day.',
        primary_button_text: 'Shop Now',
        secondary_button_text: 'Build Your Bouquet',
      },
      ar: {
        eyebrow: 'طازجة · مصنوعة يدوياً · في نفس اليوم',
        title: 'زهور تعبّر من القلب',
        description: 'باقات زهور طازجة تُحضّر بحب وتُسلّم في نفس اليوم.',
        primary_button_text: 'تسوق الآن',
        secondary_button_text: 'اصنع باقتك',
      },
    },
  },
  {
    moduleSlug: 'bakers-bakery',
    slug: 'main-hero',
    backgroundImage: '/assets/images/hero/bakers-bakery-hero.jpg',
    mobileBackgroundImage: '/assets/images/hero/bakers-bakery-hero-mobile.jpg',
    primaryButtonUrl: '/menu',
    secondaryButtonUrl: '/custom-cake',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'Fresh · Baked Daily · Handmade',
        title: 'Fresh Bakes for Every Moment',
        description:
          'Enjoy cakes, pastries, and desserts baked fresh with premium ingredients.',
        primary_button_text: 'Shop Now',
        secondary_button_text: 'Order Custom Cake',
      },
      ar: {
        eyebrow: 'طازج · مخبوز يومياً · مصنوع يدوياً',
        title: 'مخبوزات طازجة لكل لحظة',
        description:
          'استمتع بالكعك والمعجنات والحلويات الطازجة المصنوعة من مكونات عالية الجودة.',
        primary_button_text: 'تسوق الآن',
        secondary_button_text: 'اطلب كيك مخصص',
      },
    },
  },
  {
    moduleSlug: 'elements-du-chocolate',
    slug: 'main-hero',
    backgroundImage: '/assets/images/hero/elements-du-chocolate-hero.jpg',
    mobileBackgroundImage:
      '/assets/images/hero/elements-du-chocolate-hero-mobile.jpg',
    primaryButtonUrl: '/menu',
    secondaryButtonUrl: '/gift-boxes',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'Maison de Chocolat · Premium Gifts',
        title: 'Sweet Delights Await You',
        description:
          'Discover luxurious chocolates, desserts, and gift boxes crafted to perfection.',
        primary_button_text: 'View the Menu',
        secondary_button_text: 'Explore Gifts',
      },
      ar: {
        eyebrow: 'ميزون دو شوكولا · هدايا فاخرة',
        title: 'حلويات فاخرة بانتظارك',
        description:
          'اكتشف الشوكولاتة الفاخرة والحلويات وصناديق الهدايا المصنوعة بإتقان.',
        primary_button_text: 'عرض القائمة',
        secondary_button_text: 'استكشف الهدايا',
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

export async function seedHeroSections(dataSource: DataSource) {
  for (const heroSection of heroSections) {
    const moduleRows = await dataSource.query(
      `
      SELECT id
      FROM modules
      WHERE slug = $1
      LIMIT 1
      `,
      [heroSection.moduleSlug],
    );

    if (!moduleRows.length) {
      console.warn(`Module not found for hero section: ${heroSection.moduleSlug}`);
      continue;
    }

    const moduleId = Number(moduleRows[0].id);

    const existingRows = await dataSource.query(
      `
      SELECT id
      FROM module_hero_sections
      WHERE module_id = $1
      AND slug = $2
      LIMIT 1
      `,
      [moduleId, heroSection.slug],
    );

    let heroSectionId: number;

    if (existingRows.length) {
      heroSectionId = Number(existingRows[0].id);

      await dataSource.query(
        `
        UPDATE module_hero_sections
        SET
          background_image = $1,
          mobile_background_image = $2,
          primary_button_url = $3,
          secondary_button_url = $4,
          priority = $5,
          is_active = true,
          updated_at = now()
        WHERE id = $6
        `,
        [
          heroSection.backgroundImage,
          heroSection.mobileBackgroundImage,
          heroSection.primaryButtonUrl,
          heroSection.secondaryButtonUrl,
          heroSection.priority,
          heroSectionId,
        ],
      );
    } else {
      const insertedRows = await dataSource.query(
        `
        INSERT INTO module_hero_sections (
          module_id,
          slug,
          background_image,
          mobile_background_image,
          primary_button_url,
          secondary_button_url,
          priority,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        RETURNING id
        `,
        [
          moduleId,
          heroSection.slug,
          heroSection.backgroundImage,
          heroSection.mobileBackgroundImage,
          heroSection.primaryButtonUrl,
          heroSection.secondaryButtonUrl,
          heroSection.priority,
        ],
      );

      heroSectionId = Number(insertedRows[0].id);
    }

    for (const langCode of Object.keys(heroSection.translations)) {
      const fields = heroSection.translations[langCode];

      for (const fieldName of Object.keys(fields)) {
        await upsertTranslation(
          dataSource,
          'module_hero_section',
          heroSectionId,
          fieldName,
          fields[fieldName],
          langCode,
        );
      }
    }
  }

  console.log('Module hero sections seeded successfully');
}