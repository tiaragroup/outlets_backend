import { DataSource } from 'typeorm';

const modules = [
  {
    slug: 'elements-du-chocolate',
    priority: 1,
    logo: '/assets/images/elements-de-choclate.png',
    coverImage: '/assets/images/elements-de-choclate.png',
    authImage: '/assets/images/elements-de-choclate.png',
    colors: {
      primary: '#050505',
      secondary: '#E7BF94',
      light: '#FFF7EC',
      text: '#FFFFFF',
    },
    translations: {
      en: {
        name: 'Éléments du Chocolat',
        auth_title: 'Welcome to Éléments du Chocolat',
        auth_description: 'Manage chocolate menus, products, and outlet orders.',
      },
      ar: {
        name: 'إليمنتس دو شوكولا',
        auth_title: 'مرحباً بك في إليمنتس دو شوكولا',
        auth_description: 'إدارة قوائم الشوكولاتة والمنتجات وطلبات الفرع.',
      },
    },
  },
  {
    slug: 'bakers-bakery',
    priority: 2,
    logo: '/assets/images/bakers.svg',
    coverImage: '/assets/images/bakers.svg',
    authImage: '/assets/images/bakers.svg',
    colors: {
      primary: '#D6B37A',
      secondary: '#4C4337',
      light: '#FFF8ED',
      text: '#FFFFFF',
    },
    translations: {
      en: {
        name: 'Bakers Bakery',
        auth_title: 'Welcome to Bakers Bakery',
        auth_description: 'Manage bakery menus, cakes, pastries, and orders.',
      },
      ar: {
        name: 'بيكرز بيكري',
        auth_title: 'مرحباً بك في بيكرز بيكري',
        auth_description: 'إدارة قوائم المخبوزات والكعك والمعجنات والطلبات.',
      },
    },
  },
  {
    slug: 'flower-scent',
    priority: 3,
    logo: '/assets/images/Flower-scent.svg',
    coverImage: '/assets/images/Flower-scent.svg',
    authImage: '/assets/images/Flower-scent.svg',
    colors: {
      primary: '#405C4E',
      secondary: '#FDD4A9',
      light: '#FFF5EC',
      text: '#FFFFFF',
    },
    translations: {
      en: {
        name: 'Flower Scent',
        auth_title: 'Welcome to Flower Scent',
        auth_description: 'Manage flowers, bouquets, gifts, and customer orders.',
      },
      ar: {
        name: 'فلاور سنت',
        auth_title: 'مرحباً بك في فلاور سنت',
        auth_description: 'إدارة الزهور والباقات والهدايا وطلبات العملاء.',
      },
    },
  },
];

export async function seedModules(dataSource: DataSource) {
  for (const item of modules) {
    const inserted = await dataSource.query(
      `
      INSERT INTO modules (
        slug,
        priority,
        logo,
        cover_image,
        auth_image,
        primary_color,
        secondary_color,
        light_color,
        text_color,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      ON CONFLICT (slug)
      DO UPDATE SET
        priority = EXCLUDED.priority,
        logo = EXCLUDED.logo,
        cover_image = EXCLUDED.cover_image,
        auth_image = EXCLUDED.auth_image,
        primary_color = EXCLUDED.primary_color,
        secondary_color = EXCLUDED.secondary_color,
        light_color = EXCLUDED.light_color,
        text_color = EXCLUDED.text_color,
        updated_at = now()
      RETURNING id
      `,
      [
        item.slug,
        item.priority,
        item.logo,
        item.coverImage,
        item.authImage,
        item.colors.primary,
        item.colors.secondary,
        item.colors.light,
        item.colors.text,
      ],
    );

    const moduleId = inserted[0].id;

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
          VALUES ('module', $1, $2, $3, $4)
          ON CONFLICT (model_type, model_id, lang_code, field_name)
          DO UPDATE SET
            field_value = EXCLUDED.field_value,
            updated_at = now()
          `,
          [moduleId, langCode, fieldName, fields[fieldName]],
        );
      }
    }
  }

  console.log('Modules seeded successfully');
}