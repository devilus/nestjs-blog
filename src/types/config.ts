export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  migrations: string[];
  migrationsRun: boolean;
  synchronize: boolean;
  dropSchema?: boolean;
  logging: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  ttl: number;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
}

export interface ApiConfig {
  prefix: string;
  version: string;
  docsPath: string;
}
