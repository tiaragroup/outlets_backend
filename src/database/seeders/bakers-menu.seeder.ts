import { DataSource } from 'typeorm';

type BakersMenuVariant = {
  label: string;
  labelAr?: string;
  price: number;
};

type BakersMenuItem = {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  variants: BakersMenuVariant[];
  image?: string;
  isActive?: boolean;
};

type BakersMenuSection = {
  id: string;
  title: string;
  titleAr?: string;
  items: BakersMenuItem[];
};

const bakersMenuSections: BakersMenuSection[] = [
  {
    id: 'cakes',
    title: 'Cakes',
    titleAr: 'الكيك',
    items: [
      {
        name: 'Rocher Cake',
        nameAr: 'كيك روشيه',
        description: 'praline, biscuite, soft mousse',
        descriptionAr: 'برالين، بسكويت، موس ناعم',
        image: '/assets/images/bakers/cakes/Rocher-Cake.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 335 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 310 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 275 },
        ],
        isActive: true,
      },
      {
        name: 'Mouroise',
        nameAr: 'مورويس',
        description: 'cardamom ganche. Breton. Marmalade',
        descriptionAr: 'غاناش الهيل، بريتون، مربى',
        variants: [],
        isActive: false,
      },
      {
        name: 'Pecan Chocolate',
        nameAr: 'شوكولاتة البيكان',
        description: 'caramel creamux, crunchy, milk chocolate whipped ganache',
        descriptionAr: 'كريمو كراميل، كرانشي، غاناش شوكولاتة الحليب المخفوق',
        image: '/assets/images/bakers/cakes/Pecan-Chocolate.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 345 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 315 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 280 },
        ],
        isActive: true,
      },
      {
        name: 'Pistachio & Raspberry',
        nameAr: 'الفستق والتوت',
        description:
          'dacquoise, pistachio creamux, raspberry confit, pistachio crumble',
        descriptionAr: 'داكواز، كريمو الفستق، كونفي التوت، كرامبل الفستق',
        image:
          '/assets/images/bakers/cakes/Pistachio-raspberry-mousse-on-a-plate.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 355 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 325 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 290 },
        ],
        isActive: true,
      },
      {
        name: 'Tiara Mousse Special',
        nameAr: 'موس تيارا الخاص',
        description: 'dark chocolate 64%, chocolate sponge, hazelnut crumble',
        descriptionAr: 'شوكولاتة داكنة 64%، إسفنج شوكولاتة، كرامبل البندق',
        image:
          '/assets/images/bakers/cakes/Velvet-chocolate-mousse-cake-with-hazelnuts.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 345 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 315 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 280 },
        ],
        isActive: true,
      },
      {
        name: 'Saint Sebastian',
        nameAr: 'سان سيباستيان',
        description: 'creamy cheese, vanilla',
        descriptionAr: 'جبنة كريمية، فانيليا',
        image:
          '/assets/images/bakers/cakes/Creamy Basque cheesecake on a plate.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 365 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 330 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 295 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'glass-plate-dessert-showcase',
    title: 'Glass Plate Dessert Showcase',
    titleAr: 'عرض حلويات الأطباق الزجاجية',
    items: [
      {
        name: 'Classic Tiramisu',
        nameAr: 'تيراميسو كلاسيك',
        description: 'crunchy, salted caramel, viennos, mascarpone cream',
        descriptionAr: 'كرانشي، كراميل مملح، فينواز، كريمة ماسكاربوني',
        image: '/assets/images/bakers/show-case/Classic-Tiramisu.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 345 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 315 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 285 },
        ],
        isActive: true,
      },
      {
        name: 'Mango Cheese Cake',
        nameAr: 'تشيز كيك المانجو',
        description: 'new york cheese cake, mango jam, insert, fresh mango',
        descriptionAr: 'تشيز كيك نيويورك، مربى مانجو، حشوة، مانجو طازج',
        image: '/assets/images/bakers/show-case/Mango-Cheese-Cake.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 95 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 85 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 75 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'individual',
    title: 'Individual',
    titleAr: 'حلويات فردية',
    items: [
      {
        name: 'Crunchy Tiramisu',
        nameAr: 'تيراميسو كرانشي',
        description: 'old fashion glass',
        descriptionAr: 'كأس أولد فاشن',
        image:
          '/assets/images/bakers/individual/Layered-dessert-with-cocoa-and-crunch.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 58 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 52 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 45 },
        ],
        isActive: true,
      },
      {
        name: 'Berries Cream Brulee',
        nameAr: 'كريم بروليه بالتوت',
        description: 'old fashion glass',
        descriptionAr: 'كأس أولد فاشن',
        image:
          '/assets/images/bakers/individual/Layered-berry-crème-brûlée-delight.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 55 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 48 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 42 },
        ],
        isActive: true,
      },
      {
        name: 'Pecan Chocolate',
        nameAr: 'شوكولاتة البيكان',
        description: 'rectangle 10 cm by 3 cm',
        descriptionAr: 'مستطيل 10 سم × 3 سم',
        image:
          '/assets/images/bakers/individual/Decadent chocolate dessert with pecans.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 52 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 46 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 40 },
        ],
        isActive: true,
      },
      {
        name: 'Rocher Cake',
        nameAr: 'كيك روشيه',
        description: 'triangle 10 cm by 5 cm',
        descriptionAr: 'مثلث 10 سم × 5 سم',
        image:
          '/assets/images/bakers/individual/Decadent chocolate dessert with pecans.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 45 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 38 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 32 },
        ],
        isActive: true,
      },
      {
        name: 'Paris Brest',
        nameAr: 'باريس بريست',
        description: 'round shape',
        descriptionAr: 'شكل دائري',
        image:
          '/assets/images/bakers/individual/Elegant-Paris-Brest-with-hazelnut-topping.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 48 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 42 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 36 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'macarons',
    title: 'Macarons',
    titleAr: 'ماكارون',
    items: [
      {
        name: 'Vanilla Macaroon',
        nameAr: 'ماكارون الفانيليا',
        description: 'as per choice',
        descriptionAr: 'حسب الاختيار',
        image:
          '/assets/images/bakers/macarons/Elegant-macaron-with-vanilla-accents.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 12 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 10 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 8.5 },
        ],
        isActive: true,
      },
      {
        name: 'Pistachio Macaroon',
        nameAr: 'ماكارون الفستق',
        description: 'as per choice',
        descriptionAr: 'حسب الاختيار',
        image:
          '/assets/images/bakers/macarons/Pistachio-macaron-with-crumbs-and-nuts.png',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 12 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 10 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 8.5 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'travel-cakes',
    title: 'Travel Cakes',
    titleAr: 'كيك السفر',
    items: [
      {
        name: 'Marble Cake',
        nameAr: 'كيك الرخام',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 145 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 125 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 110 },
        ],
        isActive: true,
      },
      {
        name: 'Lime Cake',
        nameAr: 'كيك الليمون',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 145 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 125 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 110 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'bon-bon',
    title: 'Bon Bon',
    titleAr: 'بون بون',
    items: [
      {
        name: 'Passion & Mango',
        nameAr: 'باشن فروت ومانجو',
        description: 'passion fruit ganache, mango jelly insert',
        descriptionAr: 'غاناش باشن فروت، حشوة جيلي المانجو',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 11 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 9 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 7.5 },
        ],
        isActive: true,
      },
      {
        name: 'Lemon Ginger',
        nameAr: 'ليمون وزنجبيل',
        description: 'white chocolate, ginger, lemon juice',
        descriptionAr: 'شوكولاتة بيضاء، زنجبيل، عصير ليمون',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 10 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 8.5 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 7 },
        ],
        isActive: true,
      },
      {
        name: 'Dates',
        nameAr: 'تمر',
        description: 'sukri date, cream 34%, chocolate',
        descriptionAr: 'تمر سكري، كريمة 34%، شوكولاتة',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 11 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 9 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 7.5 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'classic-chocolate-enrobed',
    title: 'Classic Chocolate Enrobed',
    titleAr: 'شوكولاتة كلاسيكية مغلفة',
    items: [
      {
        name: 'Mistika',
        nameAr: 'مستكة',
        description: 'mistika, cream, chocolate',
        descriptionAr: 'مستكة، كريمة، شوكولاتة',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 10 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 8.5 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 7 },
        ],
        isActive: true,
      },
      {
        name: 'Mint',
        nameAr: 'نعناع',
        description: 'mint leaves, mentose, chocolate, cream',
        descriptionAr: 'أوراق نعناع، منتوس، شوكولاتة، كريمة',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 9 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 7.5 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 6 },
        ],
        isActive: true,
      },
      {
        name: 'Choco Pie',
        nameAr: 'شوكو باي',
        description: 'alunga, cream, butter, glucose',
        descriptionAr: 'ألُونغا، كريمة، زبدة، جلوكوز',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 9 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 7.5 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 6 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'praline-enrobed',
    title: 'Praline Enrobed',
    titleAr: 'برالين مغلف',
    items: [
      {
        name: 'Hazelnut Rocher',
        nameAr: 'روشيه البندق',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 11 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 9 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 7.5 },
        ],
        isActive: true,
      },
      {
        name: 'Pecan Crunch',
        nameAr: 'كرانش البيكان',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 11 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 9 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 7.5 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'mellow-cake-enrobed',
    title: 'Mellow Cake Enrobed',
    titleAr: 'ميلو كيك مغلف',
    items: [
      {
        name: 'Marshmallow Raspberry',
        nameAr: 'مارشميلو التوت',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 9 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 7.5 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 6 },
        ],
        isActive: true,
      },
      {
        name: 'Marshmallow Hazelnut',
        nameAr: 'مارشميلو البندق',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 9 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 7.5 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 6 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'bakery-section',
    title: 'Bakery Section',
    titleAr: 'قسم المخبوزات',
    items: [
      {
        name: 'Banana Bread Loaf',
        nameAr: 'رغيف خبز الموز',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 145 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 125 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 110 },
        ],
        isActive: true,
      },
      {
        name: 'Brioche Bread Loaf',
        nameAr: 'رغيف خبز البريوش',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 65 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 55 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 45 },
        ],
        isActive: true,
      },
      {
        name: 'Pain au Chocolate',
        nameAr: 'بان أو شوكولا',
        description: '120 gram',
        descriptionAr: '120 جرام',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 26 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 22 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 18 },
        ],
        isActive: true,
      },
      {
        name: 'Turkey & Cheddar Croissant',
        nameAr: 'كرواسون ديك رومي وشيدر',
        description: '',
        descriptionAr: '',
        variants: [
          { label: 'Tier A', labelAr: 'الفئة أ', price: 28 },
          { label: 'Tier B', labelAr: 'الفئة ب', price: 24 },
          { label: 'Tier C', labelAr: 'الفئة ج', price: 20 },
        ],
        isActive: true,
      },
    ],
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

export async function seedBakersMenu(dataSource: DataSource) {
  const moduleRows = await dataSource.query(
    `
    SELECT id
    FROM modules
    WHERE slug = $1
    LIMIT 1
    `,
    ['bakers-bakery'],
  );

  if (!moduleRows.length) {
    console.warn('Bakers Bakery module not found. Run seedModules first.');
    return;
  }

  const moduleId = Number(moduleRows[0].id);

  for (const [categoryIndex, section] of bakersMenuSections.entries()) {
    const categoryRows = await dataSource.query(
      `
      INSERT INTO menu_categories (
        module_id,
        slug,
        image,
        priority,
        is_active
      )
      VALUES ($1, $2, $3, $4, true)
      ON CONFLICT (module_id, slug)
      DO UPDATE SET
        image = EXCLUDED.image,
        priority = EXCLUDED.priority,
        is_active = EXCLUDED.is_active,
        updated_at = now()
      RETURNING id
      `,
      [moduleId, section.id, null, categoryIndex + 1],
    );

    const categoryId = Number(categoryRows[0].id);

    await upsertTranslation(
      dataSource,
      'menu_category',
      categoryId,
      'name',
      section.title,
      'en',
    );

    await upsertTranslation(
      dataSource,
      'menu_category',
      categoryId,
      'name',
      section.titleAr,
      'ar',
    );

    for (const [itemIndex, item] of section.items.entries()) {
      const itemSlug = slugify(item.name);

      const itemRows = await dataSource.query(
        `
        INSERT INTO menu_items (
          module_id,
          category_id,
          slug,
          image,
          priority,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (category_id, slug)
        DO UPDATE SET
          module_id = EXCLUDED.module_id,
          image = EXCLUDED.image,
          priority = EXCLUDED.priority,
          is_active = EXCLUDED.is_active,
          updated_at = now()
        RETURNING id
        `,
        [
          moduleId,
          categoryId,
          itemSlug,
          item.image ?? null,
          itemIndex + 1,
          item.isActive ?? true,
        ],
      );

      const menuItemId = Number(itemRows[0].id);

      await upsertTranslation(
        dataSource,
        'menu_item',
        menuItemId,
        'name',
        item.name,
        'en',
      );

      await upsertTranslation(
        dataSource,
        'menu_item',
        menuItemId,
        'description',
        item.description,
        'en',
      );

      await upsertTranslation(
        dataSource,
        'menu_item',
        menuItemId,
        'name',
        item.nameAr,
        'ar',
      );

      await upsertTranslation(
        dataSource,
        'menu_item',
        menuItemId,
        'description',
        item.descriptionAr,
        'ar',
      );

      const oldVariants = await dataSource.query(
        `
        SELECT id
        FROM menu_item_variants
        WHERE menu_item_id = $1
        `,
        [menuItemId],
      );

      const oldVariantIds = oldVariants.map(
        (row: { id: string | number }) => Number(row.id),
      );

      if (oldVariantIds.length) {
        await dataSource.query(
          `
          DELETE FROM translations
          WHERE model_type = 'menu_item_variant'
          AND model_id = ANY($1::int[])
          `,
          [oldVariantIds],
        );
      }

      await dataSource.query(
        `
        DELETE FROM menu_item_variants
        WHERE menu_item_id = $1
        `,
        [menuItemId],
      );

      for (const [variantIndex, variant] of item.variants.entries()) {
        const variantRows = await dataSource.query(
          `
          INSERT INTO menu_item_variants (
            menu_item_id,
            price,
            calories,
            priority,
            is_active
          )
          VALUES ($1, $2, $3, $4, true)
          RETURNING id
          `,
          [menuItemId, variant.price, null, variantIndex + 1],
        );

        const variantId = Number(variantRows[0].id);

        await upsertTranslation(
          dataSource,
          'menu_item_variant',
          variantId,
          'label',
          variant.label,
          'en',
        );

        await upsertTranslation(
          dataSource,
          'menu_item_variant',
          variantId,
          'label',
          variant.labelAr,
          'ar',
        );
      }
    }
  }

  console.log('Bakers menu seeded successfully with English and Arabic');
}