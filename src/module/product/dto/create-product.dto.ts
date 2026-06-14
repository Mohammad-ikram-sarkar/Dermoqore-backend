import {
  IsArray,
  IsBoolean,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductStatusDto {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  ARCHIVED = 'ARCHIVED',
}

export class ProductImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  percentage?: string;
}

export class ProductUsageDto {
  @IsNumber()
  @Min(1)
  stepNumber: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ProductBenefitDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class ProductSeoDto {
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeyword?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  comparePrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  skinType?: string;

  @IsEnum(ProductStatusDto)
  @IsOptional()
  status?: ProductStatusDto;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  brandId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @IsOptional()
  images?: ProductImageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  @IsOptional()
  ingredients?: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductUsageDto)
  @IsOptional()
  howToUse?: ProductUsageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBenefitDto)
  @IsOptional()
  benefits?: ProductBenefitDto[];

  @ValidateNested()
  @Type(() => ProductSeoDto)
  @IsOptional()
  seo?: ProductSeoDto;
}
