import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

const isSsl = process.env.DB_SSL === 'true';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [User],
  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',

  ssl: isSsl
    ? {
        rejectUnauthorized: false,
      }
    : false,
});