import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  async create(postData: Partial<Post>): Promise<Post> {
    const post = this.repository.create(postData);
    return this.repository.save(post);
  }

  async findById(id: string): Promise<Post | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findWithPagination(page: number, step: number): Promise<Post[]> {
    return this.repository.find({
      skip: (page - 1) * step,
      take: step,
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateData: Partial<Post>): Promise<Post> {
    await this.repository.update(id, updateData);
    const updatedPost = await this.findById(id);
    if (!updatedPost) {
      throw new Error(`Post with ID ${id} not found after update`);
    }
    return updatedPost;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
