import 'dotenv/config';
import dataSource from './data-source';
import { seedSliders } from './seeders/sliders.seeder';

async function seed() {
  await dataSource.initialize();

  await seedSliders(dataSource);

  await dataSource.destroy();

  console.log('Only sliders seeder completed successfully');
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});