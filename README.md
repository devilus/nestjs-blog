
# NestJS Blog API

A simple CRUD blog application built with NestJS, TypeORM, PostgreSQL, Fastify, Redis, and Swagger.

## Features

- Create, read, update, and delete blog posts
- Pagination for listing posts
- Redis caching with automatic invalidation
- API documentation with Swagger

## Requirements

- Node.js
- PostgreSQL
- Redis

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=blog
REDIS_HOST=localhost
REDIS_PORT=6379

# API Configuration (optional)
API_VERSION=v1
API_PREFIX=api
API_DOCS_PATH=docs

# Test Configuration (optional - uses defaults if not set)
TEST_DATABASE_HOST=localhost
TEST_DATABASE_PORT=5433
TEST_DATABASE_NAME=blog_test
TEST_REDIS_HOST=localhost
TEST_REDIS_PORT=6380
```

### API Versioning

The application supports API versioning through environment variables:

- `API_VERSION`: API version (default: `v1`)
- `API_PREFIX`: API prefix (default: `api`)
- `API_DOCS_PATH`: Swagger documentation path (default: `docs`)

This allows you to easily change API paths without modifying code. For example:
- Default: `/api/v1/blog`
- Custom: `/rest/v2/blog` (with `API_PREFIX=rest` and `API_VERSION=v2`)

### Test Configuration

The application supports separate test configuration to isolate tests from production:

- `TEST_DATABASE_*`: Test database configuration (separate from production)
- `TEST_REDIS_*`: Test Redis configuration (separate from production)

This ensures tests run in isolation with their own database and cache instances.

## Running the app

### Local environment

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Docker

```bash
# Create environment file from example
cp .env.example .env

# Start services
docker compose up -d

# Stop services
docker compose down
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/docs
```

## API Endpoints

### Create a post
- **URL**: `/api/v1/blog`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "Post Title",
    "description": "Post Description"
  }
  ```

### Get all posts (with pagination)
- **URL**: `/api/v1/blog?page=1&step=10`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `step`: Number of items per page (default: 10)

### Get a post by ID
- **URL**: `/api/v1/blog/:id`
- **Method**: `GET`

### Update a post
- **URL**: `/api/v1/blog/:id`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description"
  }
  ```

### Delete a post
- **URL**: `/api/v1/blog/:id`
- **Method**: `DELETE`

## Testing

### Unit Tests
```bash
# Run unit tests
npm test
```

### E2E Tests
```bash
# Run e2e tests (automatically sets up and tears down test environment)
npm run test:e2e
```

**Important**: E2E tests automatically set up test environment, run tests, and clean up afterwards.

## Database Migrations

```bash
# Run pending migrations
npm run migration:run
```
