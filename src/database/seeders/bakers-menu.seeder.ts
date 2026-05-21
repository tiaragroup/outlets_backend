import { DataSource } from 'typeorm';

type BakersMenuVariant = {
  label: string;
  price: number;
};

type BakersMenuItem = {
  name: string;
  description: string;
  variants: BakersMenuVariant[];
  image?: string;
  isActive?: boolean;
};

type BakersMenuSection = {
  id: string;
  title: string;
  items: BakersMenuItem[];
};

const bakersMenuSections: BakersMenuSection[] = [
  {
    id: 'cakes',
    title: 'Cakes',
    items: [
      {
        name: 'Rocher Cake',
        description: 'praline, biscuite, soft mousse',
        image: '/assets/images/bakers/cakes/Rocher-Cake.png',
        variants: [
          { label: 'Tier A', price: 335 },
          { label: 'Tier B', price: 310 },
          { label: 'Tier C', price: 275 },
        ],
        isActive: true,
      },
      {
        name: 'Mouroise',
        description: 'cardamom ganche. Breton. Marmalade',
        variants: [],
        isActive: false,
      },
      {
        name: 'Pecan Chocolate',
        description: 'caramel creamux, crunchy, milk chocolate whipped ganache',
        image: '/assets/images/bakers/cakes/Pecan-Chocolate.png',
        variants: [
          { label: 'Tier A', price: 345 },
          { label: 'Tier B', price: 315 },
          { label: 'Tier C', price: 280 },
        ],
        isActive: true,
      },
      {
        name: 'Pistachio & Raspberry',
        description:
          'dacquoise, pistachio creamux, raspberry confit, pistachio crumble',
        image:
          '/assets/images/bakers/cakes/Pistachio-raspberry-mousse-on-a-plate.png',
        variants: [
          { label: 'Tier A', price: 355 },
          { label: 'Tier B', price: 325 },
          { label: 'Tier C', price: 290 },
        ],
        isActive: true,
      },
      {
        name: 'Tiara Mousse Special',
        description: 'dark chocolate 64%, chocolate sponge, hazelnut crumble',
        image:
          '/assets/images/bakers/cakes/Velvet-chocolate-mousse-cake-with-hazelnuts.png',
        variants: [
          { label: 'Tier A', price: 345 },
          { label: 'Tier B', price: 315 },
          { label: 'Tier C', price: 280 },
        ],
        isActive: true,
      },
      {
        name: 'Saint Sebastian',
        description: 'creamy cheese, vanilla',
        image:
          '/assets/images/bakers/cakes/Creamy Basque cheesecake on a plate.png',
        variants: [
          { label: 'Tier A', price: 365 },
          { label: 'Tier B', price: 330 },
          { label: 'Tier C', price: 295 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'glass-plate-dessert-showcase',
    title: 'Glass Plate Dessert Showcase',
    items: [
      {
        name: 'Classic Tiramisu',
        description: 'crunchy, salted caramel, viennos, mascarpone cream',
        image: '/assets/images/bakers/show-case/Classic-Tiramisu.png',
        variants: [
          { label: 'Tier A', price: 345 },
          { label: 'Tier B', price: 315 },
          { label: 'Tier C', price: 285 },
        ],
        isActive: true,
      },
      {
        name: 'Mango Cheese Cake',
        description: 'new york cheese cake, mango jam, insert, fresh mango',
        image: '/assets/images/bakers/show-case/Mango-Cheese-Cake.png',
        variants: [
          { label: 'Tier A', price: 95 },
          { label: 'Tier B', price: 85 },
          { label: 'Tier C', price: 75 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'individual',
    title: 'Individual',
    items: [
      {
        name: 'Crunchy Tiramisu',
        description: 'old fashion glass',
        image:
          '/assets/images/bakers/individual/Layered-dessert-with-cocoa-and-crunch.png',
        variants: [
          { label: 'Tier A', price: 58 },
          { label: 'Tier B', price: 52 },
          { label: 'Tier C', price: 45 },
        ],
        isActive: true,
      },
      {
        name: 'Berries Cream Brulee',
        description: 'old fashion glass',
        image:
          '/assets/images/bakers/individual/Layered-berry-crème-brûlée-delight.png',
        variants: [
          { label: 'Tier A', price: 55 },
          { label: 'Tier B', price: 48 },
          { label: 'Tier C', price: 42 },
        ],
        isActive: true,
      },
      {
        name: 'Pecan Chocolate',
        description: 'rectangle 10 cm by 3 cm',
        image:
          '/assets/images/bakers/individual/Decadent chocolate dessert with pecans.png',
        variants: [
          { label: 'Tier A', price: 52 },
          { label: 'Tier B', price: 46 },
          { label: 'Tier C', price: 40 },
        ],
        isActive: true,
      },
      {
        name: 'Rocher Cake',
        description: 'triangle 10 cm by 5 cm',
        image:
          '/assets/images/bakers/individual/Decadent chocolate dessert with pecans.png',
        variants: [
          { label: 'Tier A', price: 45 },
          { label: 'Tier B', price: 38 },
          { label: 'Tier C', price: 32 },
        ],
        isActive: true,
      },
      {
        name: 'Paris Brest',
        description: 'round shape',
        image:
          '/assets/images/bakers/individual/Elegant-Paris-Brest-with-hazelnut-topping.png',
        variants: [
          { label: 'Tier A', price: 48 },
          { label: 'Tier B', price: 42 },
          { label: 'Tier C', price: 36 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'macarons',
    title: 'Macarons',
    items: [
      {
        name: 'Vanilla Macaroon',
        description: 'as per choice',
        image:
          '/assets/images/bakers/macarons/Elegant-macaron-with-vanilla-accents.png',
        variants: [
          { label: 'Tier A', price: 12 },
          { label: 'Tier B', price: 10 },
          { label: 'Tier C', price: 8.5 },
        ],
        isActive: true,
      },
      {
        name: 'Pistachio Macaroon',
        description: 'as per choice',
        image:
          '/assets/images/bakers/macarons/Pistachio-macaron-with-crumbs-and-nuts.png',
        variants: [
          { label: 'Tier A', price: 12 },
          { label: 'Tier B', price: 10 },
          { label: 'Tier C', price: 8.5 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'travel-cakes',
    title: 'Travel Cakes',
    items: [
      {
        name: 'Marble Cake',
        description: '',
        variants: [
          { label: 'Tier A', price: 145 },
          { label: 'Tier B', price: 125 },
          { label: 'Tier C', price: 110 },
        ],
        isActive: true,
      },
      {
        name: 'Lime Cake',
        description: '',
        variants: [
          { label: 'Tier A', price: 145 },
          { label: 'Tier B', price: 125 },
          { label: 'Tier C', price: 110 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'bon-bon',
    title: 'Bon Bon',
    items: [
      {
        name: 'Passion & Mango',
        description: 'passion fruit ganache, mango jelly insert',
        variants: [
          { label: 'Tier A', price: 11 },
          { label: 'Tier B', price: 9 },
          { label: 'Tier C', price: 7.5 },
        ],
        isActive: true,
      },
      {
        name: 'Lemon Ginger',
        description: 'white chocolate, ginger, lemon juice',
        variants: [
          { label: 'Tier A', price: 10 },
          { label: 'Tier B', price: 8.5 },
          { label: 'Tier C', price: 7 },
        ],
        isActive: true,
      },
      {
        name: 'Dates',
        description: 'sukri date, cream 34%, chocolate',
        variants: [
          { label: 'Tier A', price: 11 },
          { label: 'Tier B', price: 9 },
          { label: 'Tier C', price: 7.5 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'classic-chocolate-enrobed',
    title: 'Classic Chocolate Enrobed',
    items: [
      {
        name: 'Mistika',
        description: 'mistika, cream, chocolate',
        variants: [
          { label: 'Tier A', price: 10 },
          { label: 'Tier B', price: 8.5 },
          { label: 'Tier C', price: 7 },
        ],
        isActive: true,
      },
      {
        name: 'Mint',
        description: 'mint leaves, mentose, chocolate, cream',
        variants: [
          { label: 'Tier A', price: 9 },
          { label: 'Tier B', price: 7.5 },
          { label: 'Tier C', price: 6 },
        ],
        isActive: true,
      },
      {
        name: 'Choco Pie',
        description: 'alunga, cream, butter, glucose',
        variants: [
          { label: 'Tier A', price: 9 },
          { label: 'Tier B', price: 7.5 },
          { label: 'Tier C', price: 6 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'praline-enrobed',
    title: 'Praline Enrobed',
    items: [
      {
        name: 'Hazelnut Rocher',
        description: '',
        variants: [
          { label: 'Tier A', price: 11 },
          { label: 'Tier B', price: 9 },
          { label: 'Tier C', price: 7.5 },
        ],
        isActive: true,
      },
      {
        name: 'Pecan Crunch',
        description: '',
        variants: [
          { label: 'Tier A', price: 11 },
          { label: 'Tier B', price: 9 },
          { label: 'Tier C', price: 7.5 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'mellow-cake-enrobed',
    title: 'Mellow Cake Enrobed',
    items: [
      {
        name: 'Marshmallow Raspberry',
        description: '',
        variants: [
          { label: 'Tier A', price: 9 },
          { label: 'Tier B', price: 7.5 },
          { label: 'Tier C', price: 6 },
        ],
        isActive: true,
      },
      {
        name: 'Marshmallow Hazelnut',
        description: '',
        variants: [
          { label: 'Tier A', price: 9 },
          { label: 'Tier B', price: 7.5 },
          { label: 'Tier C', price: 6 },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: 'bakery-section',
    title: 'Bakery Section',
    items: [
      {
        name: 'Banana Bread Loaf',
        description: '',
        variants: [
          { label: 'Tier A', price: 145 },
          { label: 'Tier B', price: 125 },
          { label: 'Tier C', price: 110 },
        ],
        isActive: true,
      },
      {
        name: 'Brioche Bread Loaf',
        description: '',
        variants: [
          { label: 'Tier A', price: 65 },
          { label: 'Tier B', price: 55 },
          { label: 'Tier C', price: 45 },
        ],
        isActive: true,
      },
      {
        name: 'Pain au Chocolate',
        description: '120 gram',
        variants: [
          { label: 'Tier A', price: 26 },
          { label: 'Tier B', price: 22 },
          { label: 'Tier C', price: 18 },
        ],
        isActive: true,
      },
      {
        name: 'Turkey & Cheddar Croissant',
        description: '',
        variants: [
          { label: 'Tier A', price: 28 },
          { label: 'Tier B', price: 24 },
          { label: 'Tier C', price: 20 },
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
      );

      await upsertTranslation(
        dataSource,
        'menu_item',
        menuItemId,
        'description',
        item.description,
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
        );
      }
    }
  }

  console.log('Bakers menu seeded successfully');
} 