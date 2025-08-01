import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { DatabaseConfig, RedisConfig } from '../types';

export const createDatabaseConfig = (
  configService: ConfigService,
): DatabaseConfig => {
  const dbConfig = configService.get<DatabaseConfig>('database');
  if (!dbConfig) {
    throw new Error('Database configuration not found');
  }

  return dbConfig;
};

export const createCacheConfig = (configService: ConfigService) => {
  const redisConfig = configService.get<RedisConfig>('redis');
  if (!redisConfig) {
    throw new Error('Redis configuration not found');
  }

  return {
    store: redisStore,
    host: redisConfig.host,
    port: redisConfig.port,
    ttl: redisConfig.ttl,
  };
};
