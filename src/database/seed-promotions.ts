import 'dotenv/config';
import dataSource from './data-source';
import { seedPromotions } from './seeders/promotions.seeder';

async function seed() {
  await dataSource.initialize();

  await seedPromotions(dataSource);

  await dataSource.destroy();

  console.log('Only promotions seeder completed successfully');
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});
