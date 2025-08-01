import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto, PaginationDto, UpdatePostDto } from './dto';
import { Post as PostEntity } from './entities';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, type: PostEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() postData: CreatePostDto): Promise<PostEntity> {
    return this.blogService.create(postData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiResponse({ status: 200, type: [PostEntity] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'step', required: false })
  findAll(@Query() pagination: PaginationDto): Promise<PostEntity[]> {
    return this.blogService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({ status: 200, type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.blogService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiParam({ name: 'id' })
  update(
    @Param('id') id: string,
    @Body() updateData: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.blogService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string): Promise<void> {
    return this.blogService.remove(id);
  }
}
