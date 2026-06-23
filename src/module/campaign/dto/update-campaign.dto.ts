import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignStatusDto, CampaignImageInputDto, WhySectionDto, TestimonialDto } from './create-campaign.dto';

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  videoTitle?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  campaignPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  comparePrice?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhySectionDto)
  @IsOptional()
  whySections?: WhySectionDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialDto)
  @IsOptional()
  testimonials?: TestimonialDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  included?: string[];

  @IsString()
  @IsOptional()
  offerBadge?: string;

  @IsString()
  @IsOptional()
  ctaText?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  formTitle?: string;

  @IsEnum(CampaignStatusDto)
  @IsOptional()
  status?: CampaignStatusDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CampaignImageInputDto)
  @IsOptional()
  images?: CampaignImageInputDto[];
}

export class UpdateCampaignOrderStatusDto {
  @IsEnum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}
