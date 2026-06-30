import 'dotenv/config';
import dataSource from './data-source';
import { seedSocialLinks } from './seeders/social-links.seeder';

async function seed() {
  await dataSource.initialize();

  await seedSocialLinks(dataSource);

  await dataSource.destroy();

  console.log('Only social links seeder completed successfully');
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});