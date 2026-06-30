import { DataSource } from 'typeorm';

const sliders = [
  {
    moduleSlug: 'elements-du-chocolate',
    slug: 'sweet-delights',
    image: '/assets/images/sliders/chocolate-box.jpg',
    mobileImage: '/assets/images/sliders/chocolate-box-mobile.jpg',
    buttonUrl: '/menu',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'MAISON DE CHOCOLAT · EST. MMXXVI',
        title: 'Sweet Delights',
        highlighted_text: 'Awaits',
        description:
          'Step into a universe of irresistible flavors where every dessert is crafted to perfection — from rich, indulgent treats to light and delightful creations.',
        button_text: 'View the Menu',
        badge_title: 'Pure',
        badge_subtitle: 'Cacao 70%',
      },
      ar: {
        eyebrow: 'ميزون دو شوكولا · منذ 2026',
        title: 'حلويات فاخرة',
        highlighted_text: 'بانتظارك',
        description:
          'ادخل إلى عالم من النكهات التي لا تقاوم، حيث تُحضّر كل حلوى بإتقان — من المذاقات الغنية إلى الإبداعات الخفيفة واللذيذة.',
        button_text: 'عرض القائمة',
        badge_title: 'نقي',
        badge_subtitle: 'كاكاو 70%',
      },
    },
  },
  {
    moduleSlug: 'bakers-bakery',
    slug: 'bakery-delights',
    image: '/assets/images/sliders/bakers-hero.jpg',
    mobileImage: '/assets/images/sliders/bakers-hero-mobile.jpg',
    buttonUrl: '/menu',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'BAKERS BAKERY · FRESH DAILY',
        title: 'Fresh Bakes',
        highlighted_text: 'Await You',
        description:
          'Enjoy freshly baked cakes, pastries, and desserts crafted with premium ingredients and warm bakery flavors.',
        button_text: 'View the Menu',
        badge_title: 'Fresh',
        badge_subtitle: 'Daily Bakes',
      },
      ar: {
        eyebrow: 'بيكرز بيكري · طازج يومياً',
        title: 'مخبوزات طازجة',
        highlighted_text: 'بانتظارك',
        description:
          'استمتع بالكعك والمعجنات والحلويات الطازجة المصنوعة من مكونات عالية الجودة ونكهات مخبوزة دافئة.',
        button_text: 'عرض القائمة',
        badge_title: 'طازج',
        badge_subtitle: 'مخبوزات يومية',
      },
    },
  },
  {
    moduleSlug: 'flower-scent',
    slug: 'flower-gifts',
    image: '/assets/images/sliders/flower-hero.jpg',
    mobileImage: '/assets/images/sliders/flower-hero-mobile.jpg',
    buttonUrl: '/menu',
    priority: 1,
    translations: {
      en: {
        eyebrow: 'FLOWER SCENT · GIFTS & BLOOMS',
        title: 'Beautiful Flowers',
        highlighted_text: 'For Every Moment',
        description:
          'Discover elegant bouquets and gift arrangements designed to make every occasion feel special.',
        button_text: 'View the Menu',
        badge_title: 'Bloom',
        badge_subtitle: 'Fresh Flowers',
      },
      ar: {
        eyebrow: 'فلاور سنت · زهور وهدايا',
        title: 'زهور جميلة',
        highlighted_text: 'لكل مناسبة',
        description:
          'اكتشف باقات أنيقة وتنسيقات هدايا مصممة لجعل كل مناسبة أكثر تميزاً.',
        button_text: 'عرض القائمة',
        badge_title: 'تفتح',
        badge_subtitle: 'زهور طازجة',
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

export async function seedSliders(dataSource: DataSource) {
  for (const slider of sliders) {
    const moduleRows = await dataSource.query(
      `
      SELECT id
      FROM modules
      WHERE slug = $1
      LIMIT 1
      `,
      [slider.moduleSlug],
    );

    if (!moduleRows.length) {
      console.warn(`Module not found for slider: ${slider.moduleSlug}`);
      continue;
    }

    const moduleId = Number(moduleRows[0].id);

    const existingRows = await dataSource.query(
      `
      SELECT id
      FROM module_sliders
      WHERE module_id = $1
      AND slug = $2
      LIMIT 1
      `,
      [moduleId, slider.slug],
    );

    let sliderId: number;

    if (existingRows.length) {
      sliderId = Number(existingRows[0].id);

      await dataSource.query(
        `
        UPDATE module_sliders
        SET
          image = $1,
          mobile_image = $2,
          button_url = $3,
          priority = $4,
          is_active = true,
          updated_at = now()
        WHERE id = $5
        `,
        [
          slider.image,
          slider.mobileImage,
          slider.buttonUrl,
          slider.priority,
          sliderId,
        ],
      );
    } else {
      const insertedRows = await dataSource.query(
        `
        INSERT INTO module_sliders (
          module_id,
          slug,
          image,
          mobile_image,
          button_url,
          priority,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, true)
        RETURNING id
        `,
        [
          moduleId,
          slider.slug,
          slider.image,
          slider.mobileImage,
          slider.buttonUrl,
          slider.priority,
        ],
      );

      sliderId = Number(insertedRows[0].id);
    }

    for (const langCode of Object.keys(slider.translations)) {
      const fields = slider.translations[langCode];

      for (const fieldName of Object.keys(fields)) {
        await upsertTranslation(
          dataSource,
          'module_slider',
          sliderId,
          fieldName,
          fields[fieldName],
          langCode,
        );
      }
    }
  }

  console.log('Module sliders seeded successfully');
}