import 'dotenv/config';
import dataSource from './data-source';
import { seedHeroSections } from './seeders/hero-sections.seeder';

async function seed() {
  await dataSource.initialize();

  await seedHeroSections(dataSource);

  await dataSource.destroy();

  console.log('Only hero sections seeder completed successfully');
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});