import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { BlogStatus } from '../../@generated/prisma/enums';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(query: BlogQueryDto) {
    return this.blogRepository.findAll(query);
  }

  async findPublished(query: BlogQueryDto) {
    return this.blogRepository.findPublished(query);
  }

  async findOne(id: string) {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async findBySlug(slug: string) {
    const blog = await this.blogRepository.findBySlug(slug);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async create(dto: CreateBlogDto, authorId: string) {
    const categoryExists = await this.blogRepository.checkCategoryExists(
      dto.categoryId,
    );
    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    return this.blogRepository.create(dto, authorId);
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    userId: string,
    userRole: string,
  ) {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (userRole !== 'ADMIN' && blog.authorId !== userId) {
      throw new ForbiddenException('You can only update your own blogs');
    }

    if (dto.categoryId) {
      const categoryExists = await this.blogRepository.checkCategoryExists(
        dto.categoryId,
      );
      if (!categoryExists) {
        throw new BadRequestException('Category not found');
      }
    }

    return this.blogRepository.update(id, dto);
  }

  async remove(id: string, userId: string, userRole: string) {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (userRole !== 'ADMIN' && blog.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own blogs');
    }

    await this.blogRepository.remove(id);
  }

  async findFeatured(limit?: number) {
    return this.blogRepository.findFeatured(limit);
  }

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const url = await this.cloudinaryService.uploadImage(file, 'admin/blog');
    return { url };
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const imageUrl = await this.cloudinaryService.uploadImage(
      file,
      'admin/blog',
    );
    return this.blogRepository.updateImage(id, imageUrl);
  }

  async findRelated(blogId: string, categoryId: string, limit?: number) {
    return this.blogRepository.findRelated(blogId, categoryId, limit);
  }

  async publish(id: string, userId: string, userRole: string) {
    return this.update(id, { status: BlogStatus.PUBLISHED }, userId, userRole);
  }

  async unpublish(id: string, userId: string, userRole: string) {
    return this.update(id, { status: BlogStatus.DRAFT }, userId, userRole);
  }

  async toggleFeatured(id: string, userId: string, userRole: string) {
    const blog = await this.blogRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return this.update(id, { featured: !blog.featured }, userId, userRole);
  }
}
