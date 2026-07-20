import 'dotenv/config';
import dataSource from './data-source';
import { WhatsAppSocialLinksSeeder } from './seeders/whatsapp-social-links.seeder';

async function seed() {
  await dataSource.initialize();

  await WhatsAppSocialLinksSeeder.run(dataSource);

  await dataSource.destroy();

  console.log('Only WhatsApp social links seeder completed successfully');
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});