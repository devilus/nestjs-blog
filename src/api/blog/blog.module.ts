import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PostRepository } from './repositories';
import { CacheModule } from '../../modules/cache';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), CacheModule],
  controllers: [BlogController],
  providers: [BlogService, PostRepository],
  exports: [BlogService],
})
export class BlogModule {}
