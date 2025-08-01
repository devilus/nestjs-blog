import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => {
  if (process.env.NODE_ENV === 'test') {
    return {
      type: 'postgres',
      host: process.env.TEST_DATABASE_HOST || 'localhost',
      port: parseInt(process.env.TEST_DATABASE_PORT || '5433', 10),
      username: process.env.TEST_DATABASE_USERNAME || 'postgres',
      password: process.env.TEST_DATABASE_PASSWORD || 'postgres',
      database: process.env.TEST_DATABASE_NAME || 'blog_test',
      entities: [__dirname + '/../api/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: false,
      synchronize: true,
      dropSchema: true,
      logging: false,
    };
  }

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'blog',
    entities: [__dirname + '/../api/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: process.env.NODE_ENV !== 'production',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  };
});

export const redisConfig = registerAs('redis', () => {
  if (process.env.NODE_ENV === 'test') {
    return {
      host: process.env.TEST_REDIS_HOST || 'localhost',
      port: parseInt(process.env.TEST_REDIS_PORT || '6380', 10),
      ttl: 1000,
    };
  }

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    ttl: parseInt(process.env.REDIS_TTL || '60000', 10),
  };
});

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
}));

export const apiConfig = registerAs('api', () => ({
  prefix: process.env.API_PREFIX || 'api',
  version: process.env.API_VERSION || 'v1',
  docsPath: process.env.API_DOCS_PATH || 'docs',
}));
