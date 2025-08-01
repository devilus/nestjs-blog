import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities';
import { CreatePostDto, PaginationDto, UpdatePostDto } from './dto';
import { PostRepository } from './repositories';
import { CacheService } from '../../modules/cache';

@Injectable()
export class BlogService {
  constructor(
    private postRepository: PostRepository,
    private cacheService: CacheService,
  ) {}

  async create(postData: CreatePostDto): Promise<Post> {
    const post = await this.postRepository.create(postData);
    await this.invalidatePostsCache();
    return post;
  }

  async findAll(pagination: PaginationDto): Promise<Post[]> {
    const { page, step } = pagination;
    const cacheKey = this.cacheService.generateKey('posts', page, step);

    return this.getCachedOrFetch(cacheKey, () =>
      this.postRepository.findWithPagination(page, step),
    );
  }

  async findOne(id: string): Promise<Post> {
    const cacheKey = this.cacheService.generateKey('post', id);

    return this.getCachedOrFetch(cacheKey, async () => {
      const post = await this.postRepository.findById(id);
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      return post;
    });
  }

  async update(id: string, updateData: UpdatePostDto): Promise<Post> {
    await this.findOne(id);
    const updatedPost = await this.postRepository.update(id, updateData);
    await this.invalidateCache(id);
    return updatedPost;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.postRepository.delete(id);
    await this.invalidateCache(id);
  }

  private async getCachedOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.cacheService.get<T>(key);
    if (cached) return cached;

    const data = await fetchFn();
    await this.cacheService.set(key, data);
    return data;
  }

  private async invalidateCache(id: string): Promise<void> {
    await this.cacheService.delete(this.cacheService.generateKey('post', id));
  }

  private async invalidatePostsCache(): Promise<void> {
    await this.cacheService.clear();
  }
}
