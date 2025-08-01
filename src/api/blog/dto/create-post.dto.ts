import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ description: 'Post description' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  description: string;
}
