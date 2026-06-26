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
import {
  CampaignStatusDto,
  CampaignThemeDto,
  CampaignImageInputDto,
  WhySectionDto,
  TestimonialDto,
  CustomerReviewDto,
  FeatureDto,
  IngredientDto,
  FaqItemDto,
} from './create-campaign.dto';

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

export class UpdateCampaignOrderStatusDto {
  @IsEnum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}
