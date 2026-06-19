import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { BlogStatus } from '../../../@generated/prisma/enums';
import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
