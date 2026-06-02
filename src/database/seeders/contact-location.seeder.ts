import { DataSource } from 'typeorm';

const outletLocations = [
  {
    moduleSlug: 'bakers-bakery',
    address: 'Bakers Bakery, Riyadh, Saudi Arabia',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    mapUrl:
      'https://maps.google.com/?q=Bakers%20Bakery%20Riyadh%20Saudi%20Arabia',
    latitude: 24.7136,
    longitude: 46.6753,
    translations: {
      en: {
        address: 'Bakers Bakery, Riyadh, Saudi Arabia',
        city: 'Riyadh',
        country: 'Saudi Arabia',
      },
      ar: {
        address: 'بيكرز بيكري، الرياض، المملكة العربية السعودية',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
      },
    },
  },
  {
    moduleSlug: 'elements-du-chocolate',
    address: 'Elements Du Chocolat, Riyadh, Saudi Arabia',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    mapUrl:
      'https://maps.google.com/?q=Elements%20Du%20Chocolat%20Riyadh%20Saudi%20Arabia',
    latitude: 24.7136,
    longitude: 46.6753,
    translations: {
      en: {
        address: 'Elements Du Chocolat, Riyadh, Saudi Arabia',
        city: 'Riyadh',
        country: 'Saudi Arabia',
      },
      ar: {
        address: 'إليمنتس دو شوكولا، الرياض، المملكة العربية السعودية',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
      },
    },
  },
  {
    moduleSlug: 'flower-scent',
    address: 'Flower Scent, Riyadh, Saudi Arabia',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    mapUrl:
      'https://maps.google.com/?q=Flower%20Scent%20Riyadh%20Saudi%20Arabia',
    latitude: 24.7136,
    longitude: 46.6753,
    translations: {
      en: {
        address: 'Flower Scent, Riyadh, Saudi Arabia',
        city: 'Riyadh',
        country: 'Saudi Arabia',
      },
      ar: {
        address: 'فلاور سنت، الرياض، المملكة العربية السعودية',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
      },
    },
  },
];

const outletContacts = [
  {
    moduleSlug: 'bakers-bakery',
    name: 'Bakers Bakery',
    nameAr: 'بيكرز بيكري',
    phone: '920014425',
    email: 'hello@bakersbakery.com',
    websiteUrl: 'https://www.bakersbakery.com',
  },
  {
    moduleSlug: 'elements-du-chocolate',
    name: 'Elements Du Chocolat',
    nameAr: 'إليمنتس دو شوكولا',
    phone: '920014426',
    email: 'hello@elementsduchocolat.com',
    websiteUrl: 'https://www.elementsduchocolat.com',
  },
  {
    moduleSlug: 'flower-scent',
    name: 'Flower Scent',
    nameAr: 'فلاور سنت',
    phone: '920014427',
    email: 'hello@flowerscent.com',
    websiteUrl: 'https://www.flowerscent.com',
  },
  {
    moduleSlug: null,
    name: 'Cater-Me',
    nameAr: 'كاتر مي',
    phone: '920020062',
    email: null,
    websiteUrl: null,
  },
  {
    moduleSlug: null,
    name: 'Cater Hub',
    nameAr: 'كاتر هب',
    phone: '920025325',
    email: null,
    websiteUrl: null,
  },
  {
    moduleSlug: null,
    name: 'PriFit',
    nameAr: 'براي فت',
    phone: '920002044',
    email: null,
    websiteUrl: null,
  },
  {
    moduleSlug: null,
    name: 'Tiara Catering',
    nameAr: 'تيارا للضيافة',
    phone: '920005600',
    email: null,
    websiteUrl: null,
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

export async function seedContactLocation(dataSource: DataSource) {
  /**
   * Disable old global location rows that are not connected to modules.
   */
  await dataSource.query(`
    UPDATE global_locations
    SET is_active = false,
        updated_at = now()
    WHERE module_id IS NULL
  `);

  /**
   * Seed module-based locations.
   */
  for (const location of outletLocations) {
    const moduleRows = await dataSource.query(
      `
      SELECT id
      FROM modules
      WHERE slug = $1
      LIMIT 1
      `,
      [location.moduleSlug],
    );

    if (!moduleRows.length) {
      console.warn(`Module not found for location: ${location.moduleSlug}`);
      continue;
    }

    const moduleId = Number(moduleRows[0].id);

    const existingLocationRows = await dataSource.query(
      `
      SELECT id
      FROM global_locations
      WHERE module_id = $1
      LIMIT 1
      `,
      [moduleId],
    );

    let locationId: number;

    if (existingLocationRows.length) {
      locationId = Number(existingLocationRows[0].id);

      await dataSource.query(
        `
        UPDATE global_locations
        SET
          address = $1,
          city = $2,
          country = $3,
          map_url = $4,
          latitude = $5,
          longitude = $6,
          is_active = true,
          updated_at = now()
        WHERE id = $7
        `,
        [
          location.address,
          location.city,
          location.country,
          location.mapUrl,
          location.latitude,
          location.longitude,
          locationId,
        ],
      );
    } else {
      const insertedRows = await dataSource.query(
        `
        INSERT INTO global_locations (
          module_id,
          address,
          city,
          country,
          map_url,
          latitude,
          longitude,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        RETURNING id
        `,
        [
          moduleId,
          location.address,
          location.city,
          location.country,
          location.mapUrl,
          location.latitude,
          location.longitude,
        ],
      );

      locationId = Number(insertedRows[0].id);
    }

    for (const langCode of Object.keys(location.translations)) {
      const fields = location.translations[langCode];

      for (const fieldName of Object.keys(fields)) {
        await upsertTranslation(
          dataSource,
          'global_location',
          locationId,
          fieldName,
          fields[fieldName],
          langCode,
        );
      }
    }
  }

  /**
   * Seed outlet contacts.
   */
  for (const contact of outletContacts) {
    let moduleId: number | null = null;

    if (contact.moduleSlug) {
      const moduleRows = await dataSource.query(
        `
        SELECT id
        FROM modules
        WHERE slug = $1
        LIMIT 1
        `,
        [contact.moduleSlug],
      );

      moduleId = moduleRows.length ? Number(moduleRows[0].id) : null;
    }

    const existingContactRows = await dataSource.query(
      `
      SELECT id
      FROM outlet_contacts
      WHERE name = $1
      LIMIT 1
      `,
      [contact.name],
    );

    let contactId: number;

    if (existingContactRows.length) {
      contactId = Number(existingContactRows[0].id);

      await dataSource.query(
        `
        UPDATE outlet_contacts
        SET
          module_id = $1,
          phone = $2,
          email = $3,
          website_url = $4,
          is_active = true,
          updated_at = now()
        WHERE id = $5
        `,
        [
          moduleId,
          contact.phone,
          contact.email,
          contact.websiteUrl,
          contactId,
        ],
      );
    } else {
      const insertedRows = await dataSource.query(
        `
        INSERT INTO outlet_contacts (
          module_id,
          name,
          phone,
          email,
          website_url,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING id
        `,
        [
          moduleId,
          contact.name,
          contact.phone,
          contact.email,
          contact.websiteUrl,
        ],
      );

      contactId = Number(insertedRows[0].id);
    }

    await upsertTranslation(
      dataSource,
      'outlet_contact',
      contactId,
      'name',
      contact.name,
      'en',
    );

    await upsertTranslation(
      dataSource,
      'outlet_contact',
      contactId,
      'name',
      contact.nameAr,
      'ar',
    );
  }

  console.log('Contact and module-based locations seeded successfully');
}