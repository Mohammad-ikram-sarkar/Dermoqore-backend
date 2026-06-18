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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Get('best-sellers')
  findBestSellers(@Query('limit') limit?: string) {
    return this.productService.findBestSellers(limit ? parseInt(limit, 10) : 8);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Post('admin/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.productService.uploadImage(file);
  }

  @Post('admin/:id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  addImage(
    @Param('id') id: string,
    @Body()
    body: {
      url: string;
      alt?: string;
      isPrimary?: boolean;
      sortOrder?: number;
    },
  ) {
    return this.productService.addImage(id, body);
  }
}
