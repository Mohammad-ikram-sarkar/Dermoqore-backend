import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { BlogStatus } from '../../@generated/prisma/enums';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query() query: BlogQueryDto) {
    return this.blogService.findAll(query);
  }

  @Get('published')
  findPublished(@Query() query: BlogQueryDto) {
    return this.blogService.findPublished(query);
  }

  @Get('featured')
  findFeatured(@Query('limit') limit?: string) {
    return this.blogService.findFeatured(limit ? parseInt(limit) : 5);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Get(':id/related')
  findRelated(
    @Param('id') id: string,
    @Query('categoryId') categoryId: string,
    @Query('limit') limit?: string,
  ) {
    return this.blogService.findRelated(
      id,
      categoryId,
      limit ? parseInt(limit) : 3,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateBlogDto, @GetUser() user: any) {
    return this.blogService.create(dto, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @GetUser() user: any,
  ) {
    return this.blogService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.blogService.remove(id, user.id, user.role);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminCreate(@Body() dto: CreateBlogDto, @GetUser() user: any) {
    return this.blogService.create(dto, user.id);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminUpdate(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @GetUser() user: any,
  ) {
    return this.blogService.update(id, dto, user.id, user.role);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminRemove(@Param('id') id: string, @GetUser() user: any) {
    return this.blogService.remove(id, user.id, user.role);
  }

  @Post('admin/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.blogService.upload(file);
  }

  @Post('admin/upload-image/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.uploadImage(id, file);
  }

  @Put('admin/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  publish(@Param('id') id: string, @GetUser() user: any) {
    return this.blogService.publish(id, user.id, user.role);
  }

  @Put('admin/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  unpublish(@Param('id') id: string, @GetUser() user: any) {
    return this.blogService.unpublish(id, user.id, user.role);
  }

  @Put('admin/:id/featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  toggleFeatured(@Param('id') id: string, @GetUser() user: any) {
    return this.blogService.toggleFeatured(id, user.id, user.role);
  }
}
