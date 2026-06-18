import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProductStatusDto } from './create-product.dto';

export enum ProductSortDto {
  NAME_ASC = 'nameAsc',
  PRICE_ASC = 'priceAsc',
  PRICE_DESC = 'priceDesc',
  NEWEST = 'newest',
  BEST_SELLER = 'bestSeller',
}

export class ProductQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  brandId?: string;

  @IsString()
  @IsOptional()
  skinType?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @IsEnum(ProductStatusDto)
  @IsOptional()
  status?: ProductStatusDto;

  @IsEnum(ProductSortDto)
  @IsOptional()
  sort?: ProductSortDto;
}
