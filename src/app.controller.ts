import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get application info' })
  @ApiResponse({ status: 200, description: 'Application information' })
  getInfo() {
    return {
      name: 'NestJS Blog API',
      version: '1.0.0',
      description: 'A RESTful API for blog posts management built with NestJS',
      status: '🚀 API is running successfully!',
      features: [
        'CRUD operations for blog posts',
        'Pagination support',
        'Redis caching',
        'PostgreSQL database',
        'Swagger documentation',
        'Input validation',
        'Error handling',
      ],
      endpoints: {
        docs: '/docs',
        health: '/health',
        api: '/api/v1',
        blog: '/api/v1/blog',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
