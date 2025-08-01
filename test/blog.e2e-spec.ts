import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

// Ensure tests only run in test environment
if (process.env.NODE_ENV !== 'test') {
  throw new Error('E2E tests must be run with NODE_ENV=test');
}

describe('BlogController (e2e)', () => {
  let app: INestApplication;

  // Ensure tests only run in test environment
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('E2E tests must be run with NODE_ENV=test');
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable validation in tests
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Set global prefix for API (same as in main.ts)
    const configService = app.get(ConfigService);
    const apiConfig = configService.get('api');
    const globalPrefix = `${apiConfig.prefix}/${apiConfig.version}`;
    app.setGlobalPrefix(globalPrefix);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/v1/blog (POST)', () => {
    it('should create a new post', () => {
      const createPostDto = {
        title: 'Test Post',
        description: 'This is a test post',
      };

      return request(app.getHttpServer())
        .post('/api/v1/blog')
        .send(createPostDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createPostDto.title);
          expect(res.body.description).toBe(createPostDto.description);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidPostDto = {
        title: '', // Empty title
        description: 'This is a test post',
      };

      return request(app.getHttpServer())
        .post('/api/v1/blog')
        .send(invalidPostDto)
        .expect(400);
    });
  });

  describe('/api/v1/blog (GET)', () => {
    it('should return paginated posts', () => {
      return request(app.getHttpServer())
        .get('/api/v1/blog')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return posts with pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/api/v1/blog?page=1&step=5')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/api/v1/blog/:id (GET)', () => {
    let createdPostId: string;

    beforeEach(async () => {
      // Create a post first
      const createPostDto = {
        title: 'Test Post for Get',
        description: 'This is a test post for get operation',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/blog')
        .send(createPostDto)
        .expect(201);

      createdPostId = response.body.id;
    });

    it('should return a post by id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/blog/${createdPostId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdPostId);
          expect(res.body.title).toBe('Test Post for Get');
        });
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer())
        .get('/api/v1/blog/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);
    });
  });

  describe('/api/v1/blog/:id (PUT)', () => {
    let createdPostId: string;

    beforeEach(async () => {
      // Create a post first
      const createPostDto = {
        title: 'Test Post for Update',
        description: 'This is a test post for update operation',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/blog')
        .send(createPostDto)
        .expect(201);

      createdPostId = response.body.id;
    });

    it('should update a post', () => {
      const updatePostDto = {
        title: 'Updated Title',
        description: 'Updated description',
      };

      return request(app.getHttpServer())
        .put(`/api/v1/blog/${createdPostId}`)
        .send(updatePostDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdPostId);
          expect(res.body.title).toBe(updatePostDto.title);
          expect(res.body.description).toBe(updatePostDto.description);
        });
    });

    it('should return 404 for non-existent post', () => {
      const updatePostDto = {
        title: 'Updated Title',
      };

      return request(app.getHttpServer())
        .put('/api/v1/blog/123e4567-e89b-12d3-a456-426614174000')
        .send(updatePostDto)
        .expect(404);
    });
  });

  describe('/api/v1/blog/:id (DELETE)', () => {
    let createdPostId: string;

    beforeEach(async () => {
      // Create a post first
      const createPostDto = {
        title: 'Test Post for Delete',
        description: 'This is a test post for delete operation',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/blog')
        .send(createPostDto)
        .expect(201);

      createdPostId = response.body.id;
    });

    it('should delete a post', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/blog/${createdPostId}`)
        .expect(200);
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/blog/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);
    });
  });
});
