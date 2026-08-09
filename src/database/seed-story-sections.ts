import 'dotenv/config';
import dataSource from './data-source';
import { seedStorySections } from './seeders/story-sections.seeder';

async function seed() {
  await dataSource.initialize();

  await seedStorySections(dataSource);

  await dataSource.destroy();

  console.log('Only story sections seeder completed successfully');
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});
