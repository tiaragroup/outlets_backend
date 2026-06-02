import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenuModule } from './menu/menu.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { ContactLocationModule } from './contact-location/contact-location.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      // Local: DB_HOST=localhost
      // Cloud Run/Firebase: INSTANCE_CONNECTION_NAME=project-id:region:instance-name
      host: process.env.INSTANCE_CONNECTION_NAME
        ? `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
        : process.env.DB_HOST,

      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      autoLoadEntities: true,

      // Always false. Use migrations.
      synchronize: false,

      logging: process.env.NODE_ENV !== 'production',

      // Local and Cloud SQL socket both use DB_SSL=false
      ssl:
        process.env.DB_SSL === 'true'
          ? {
              rejectUnauthorized: false,
            }
          : false,
    }),

    UsersModule,
    AuthModule,
    MenuModule,
    SocialLinksModule,
    ContactLocationModule,
  ],
})
export class AppModule {}