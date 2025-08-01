import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { BlogModule } from './api/blog/blog.module';
import { CacheModule } from './modules/cache';
import { apiConfig, appConfig, databaseConfig, redisConfig } from './config';
import { validationSchema } from './config/validation.schema';
import { createCacheConfig, createDatabaseConfig } from './config/factories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, appConfig, apiConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createDatabaseConfig,
      inject: [ConfigService],
    }),
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: createCacheConfig,
      inject: [ConfigService],
    }),
    BlogModule,
    CacheModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
