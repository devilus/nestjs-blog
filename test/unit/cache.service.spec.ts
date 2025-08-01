import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from '../../src/modules/cache';

describe('CacheService', () => {
  let service: CacheService;

  // Ensure tests only run in test environment
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Unit tests must be run with NODE_ENV=test');
  }
  let cacheManager: jest.Mocked<any>;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      clear: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return cached data', async () => {
      const key = 'test-key';
      const cachedData = { test: 'data' };

      cacheManager.get.mockResolvedValue(cachedData);

      const result = await service.get(key);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(cachedData);
    });

    it('should return null when no cached data', async () => {
      const key = 'test-key';

      cacheManager.get.mockResolvedValue(undefined);

      const result = await service.get(key);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set data in cache', async () => {
      const key = 'test-key';
      const data = { test: 'data' };
      const ttl = 5000;

      cacheManager.set.mockResolvedValue();

      await service.set(key, data, ttl);

      expect(cacheManager.set).toHaveBeenCalledWith(key, data, ttl);
    });

    it('should set data without TTL', async () => {
      const key = 'test-key';
      const data = { test: 'data' };

      cacheManager.set.mockResolvedValue();

      await service.set(key, data);

      expect(cacheManager.set).toHaveBeenCalledWith(key, data, undefined);
    });
  });

  describe('delete', () => {
    it('should delete data from cache', async () => {
      const key = 'test-key';

      cacheManager.del.mockResolvedValue();

      await service.delete(key);

      expect(cacheManager.del).toHaveBeenCalledWith(key);
    });
  });

  describe('clear', () => {
    it('should clear all cache', async () => {
      cacheManager.clear.mockResolvedValue();

      await service.clear();

      expect(cacheManager.clear).toHaveBeenCalled();
    });
  });

  describe('generateKey', () => {
    it('should generate key with prefix and params', () => {
      const prefix = 'posts';
      const params = ['1', '10'];

      const result = service.generateKey(prefix, ...params);

      expect(result).toBe('posts:1:10');
    });

    it('should generate key with single param', () => {
      const prefix = 'post';
      const param = 'test-uuid';

      const result = service.generateKey(prefix, param);

      expect(result).toBe('post:test-uuid');
    });

    it('should generate key with mixed types', () => {
      const prefix = 'cache';
      const params = ['user', 123, 'profile'];

      const result = service.generateKey(prefix, ...params);

      expect(result).toBe('cache:user:123:profile');
    });
  });
});
