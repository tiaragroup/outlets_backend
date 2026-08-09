import 'dotenv/config';
import dataSource from './data-source';
import { seedWhyChooseUs } from './seeders/why-choose-us.seeder';

async function seed() {
  await dataSource.initialize();

  await seedWhyChooseUs(dataSource);

  await dataSource.destroy();

  console.log('Only why choose us seeder completed successfully');
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});
