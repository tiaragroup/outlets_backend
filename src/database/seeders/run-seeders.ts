import { DataSource } from 'typeorm';
import { seedModules } from './modules.seeder';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  ssl:
    process.env.DB_SSL === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

async function run() {
  try {
    await dataSource.initialize();

    await seedModules(dataSource);

    await dataSource.destroy();

    console.log('All seeders completed');
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
}

run();