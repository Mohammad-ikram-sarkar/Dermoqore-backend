import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BlogStatus } from '../../../@generated/prisma/enums';

export enum BlogSortDto {
  TITLE_ASC = 'titleAsc',
  TITLE_DESC = 'titleDesc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class BlogQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  authorId?: string;

  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;

  @IsEnum(BlogSortDto)
  @IsOptional()
  sort?: BlogSortDto = BlogSortDto.NEWEST;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
