import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CampaignImageInputDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}

export enum CampaignStatusDto {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum CampaignThemeDto {
  DEFAULT = 'DEFAULT',
  EMERALD = 'EMERALD',
  ROSE = 'ROSE',
  OCEAN = 'OCEAN',
  AMBER = 'AMBER',
}

export enum DeliveryZoneDto {
  INSIDE_DHAKA = 'INSIDE_DHAKA',
  OUTSIDE_DHAKA = 'OUTSIDE_DHAKA',
}

export class WhySectionDto {
  @IsString()
  @IsNotEmpty()
  heading: string;

  @IsArray()
  @IsString({ each: true })
  items: string[];
}

export class TestimonialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CustomerReviewDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  videoTitle?: string;

  @IsString()
  @IsOptional()
  videoDescription?: string;

  @IsString()
  @IsNotEmpty()
  videoUrl: string;
}

export class FeatureDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  icon: string;
}

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class FaqItemDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  videoTitle?: string;

  @IsString()
  @IsOptional()
  productVideoUrl?: string;

  @IsString()
  @IsOptional()
  productVideoTitle?: string;

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
  @ValidateNested({ each: true })
  @Type(() => CustomerReviewDto)
  @IsOptional()
  customerReviews?: CustomerReviewDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  included?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  @IsOptional()
  features?: FeatureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  @IsOptional()
  ingredients?: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqItemDto)
  @IsOptional()
  faqs?: FaqItemDto[];

  /* ── BTRI Lab Report ── */
  @IsString()
  @IsOptional()
  labReportTitle?: string;

  @IsString()
  @IsOptional()
  labReportDescription?: string;

  @IsString()
  @IsOptional()
  labReportButtonText?: string;

  @IsString()
  @IsOptional()
  labReportButtonUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labReportImages?: string[];

  @IsEnum(CampaignThemeDto)
  @IsOptional()
  theme?: CampaignThemeDto;

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

export class PlaceCampaignOrderDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsEnum(DeliveryZoneDto)
  deliveryZone: DeliveryZoneDto;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
