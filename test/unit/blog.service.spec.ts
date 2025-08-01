import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BlogService } from '../../src/api/blog/blog.service';
import { PostRepository } from '../../src/api/blog/repositories';
import { CacheService } from '../../src/modules/cache';
import { Post } from '../../src/api/blog/entities';
import {
  CreatePostDto,
  UpdatePostDto,
  PaginationDto,
} from '../../src/api/blog/dto';

describe('BlogService', () => {
  let service: BlogService;

  // Ensure tests only run in test environment
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Unit tests must be run with NODE_ENV=test');
  }
  let postRepository: jest.Mocked<PostRepository>;
  let cacheService: jest.Mocked<CacheService>;

  const mockPost: Post = {
    id: 'test-uuid',
    title: 'Test Post',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPostRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findWithPagination: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
      generateKey: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: PostRepository,
          useValue: mockPostRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    postRepository = module.get(PostRepository);
    cacheService = module.get(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a post successfully', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        description: 'New Description',
      };

      postRepository.create.mockResolvedValue(mockPost);
      cacheService.clear.mockResolvedValue();

      const result = await service.create(createPostDto);

      expect(postRepository.create).toHaveBeenCalledWith(createPostDto);
      expect(cacheService.clear).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return posts from cache if available', async () => {
      const paginationDto: PaginationDto = { page: 1, step: 10 };
      const cachedPosts = [mockPost];

      cacheService.generateKey.mockReturnValue('posts:1:10');
      cacheService.get.mockResolvedValue(cachedPosts);

      const result = await service.findAll(paginationDto);

      expect(cacheService.get).toHaveBeenCalledWith('posts:1:10');
      expect(result).toEqual(cachedPosts);
      expect(postRepository.findWithPagination).not.toHaveBeenCalled();
    });

    it('should fetch posts from database if not in cache', async () => {
      const paginationDto: PaginationDto = { page: 1, step: 10 };
      const posts = [mockPost];

      cacheService.generateKey.mockReturnValue('posts:1:10');
      cacheService.get.mockResolvedValue(null);
      postRepository.findWithPagination.mockResolvedValue(posts);
      cacheService.set.mockResolvedValue();

      const result = await service.findAll(paginationDto);

      expect(cacheService.get).toHaveBeenCalledWith('posts:1:10');
      expect(postRepository.findWithPagination).toHaveBeenCalledWith(1, 10);
      expect(cacheService.set).toHaveBeenCalledWith('posts:1:10', posts);
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should return post from cache if available', async () => {
      const postId = 'test-uuid';

      cacheService.generateKey.mockReturnValue('post:test-uuid');
      cacheService.get.mockResolvedValue(mockPost);

      const result = await service.findOne(postId);

      expect(cacheService.get).toHaveBeenCalledWith('post:test-uuid');
      expect(result).toEqual(mockPost);
      expect(postRepository.findById).not.toHaveBeenCalled();
    });

    it('should fetch post from database if not in cache', async () => {
      const postId = 'test-uuid';

      cacheService.generateKey.mockReturnValue('post:test-uuid');
      cacheService.get.mockResolvedValue(null);
      postRepository.findById.mockResolvedValue(mockPost);
      cacheService.set.mockResolvedValue();

      const result = await service.findOne(postId);

      expect(cacheService.get).toHaveBeenCalledWith('post:test-uuid');
      expect(postRepository.findById).toHaveBeenCalledWith(postId);
      expect(cacheService.set).toHaveBeenCalledWith('post:test-uuid', mockPost);
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      const postId = 'non-existent-uuid';

      cacheService.generateKey.mockReturnValue('post:non-existent-uuid');
      cacheService.get.mockResolvedValue(null);
      postRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(postId)).rejects.toThrow(NotFoundException);
      expect(postRepository.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('update', () => {
    it('should update post successfully', async () => {
      const postId = 'test-uuid';
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };
      const updatedPost = { ...mockPost, title: 'Updated Title' };

      cacheService.generateKey.mockReturnValue('post:test-uuid');
      postRepository.findById.mockResolvedValue(mockPost);
      postRepository.update.mockResolvedValue(updatedPost);
      cacheService.delete.mockResolvedValue();

      const result = await service.update(postId, updatePostDto);

      expect(postRepository.findById).toHaveBeenCalledWith(postId);
      expect(postRepository.update).toHaveBeenCalledWith(postId, updatePostDto);
      expect(cacheService.delete).toHaveBeenCalledWith('post:test-uuid');
      expect(result).toEqual(updatedPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      const postId = 'non-existent-uuid';
      const updatePostDto: UpdatePostDto = { title: 'Updated Title' };

      postRepository.findById.mockResolvedValue(null);

      await expect(service.update(postId, updatePostDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove post successfully', async () => {
      const postId = 'test-uuid';

      cacheService.generateKey.mockReturnValue('post:test-uuid');
      postRepository.findById.mockResolvedValue(mockPost);
      postRepository.delete.mockResolvedValue();
      cacheService.delete.mockResolvedValue();

      await service.remove(postId);

      expect(postRepository.findById).toHaveBeenCalledWith(postId);
      expect(postRepository.delete).toHaveBeenCalledWith(postId);
      expect(cacheService.delete).toHaveBeenCalledWith('post:test-uuid');
    });

    it('should throw NotFoundException if post not found', async () => {
      const postId = 'non-existent-uuid';

      postRepository.findById.mockResolvedValue(null);

      await expect(service.remove(postId)).rejects.toThrow(NotFoundException);
    });
  });
});
