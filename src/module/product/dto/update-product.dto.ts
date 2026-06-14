import {
  IsArray,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IngredientDto,
  ProductBenefitDto,
  ProductImageDto,
  ProductSeoDto,
  ProductStatusDto,
  ProductUsageDto,
} from './create-product.dto';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

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
  @IsOptional()
  price?: number;

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
  @IsOptional()
  categoryId?: string;

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
