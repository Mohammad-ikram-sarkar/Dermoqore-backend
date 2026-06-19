import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(query: ProductQueryDto = {}) {
    const hasListQuery = Object.values(query).some(
      (value) => value !== undefined && value !== '',
    );

    if (hasListQuery) {
      return this.productRepository.findPaginated(query);
    }

    return this.productRepository.findAll();
  }

  async findBestSellers(limit = 8) {
    return this.productRepository.findBestSellers(limit);
  }

  async findOne(id: string) {
    const product =
      (await this.productRepository.findById(id)) ??
      (await this.productRepository.findBySlug(id));
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug ?? dto.name.toLowerCase().replace(/\s+/g, '-');
    const existing = await this.productRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException('Product slug already exists');
    }
    return this.productRepository.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (dto.slug) {
      const existing = await this.productRepository.findBySlug(dto.slug);
      if (existing && existing.id !== id) {
        throw new ConflictException('Product slug already exists');
      }
    }
    return this.productRepository.update(id, dto);
  }

  async remove(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.remove(id);
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const url = await this.cloudinaryService.uploadImage(
      file,
      'admin/products',
    );
    return { url };
  }

  async addImage(
    id: string,
    body: {
      url: string;
      alt?: string;
      isPrimary?: boolean;
      sortOrder?: number;
    },
  ) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.addImage(id, body);
  }
}
