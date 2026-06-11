import {
  IsString,
  IsOptional,
  IsEmail,
  ValidateNested,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateFooterLinkDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  href?: string;
}

class UpdateFooterSectionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFooterLinkDto)
  @IsOptional()
  links?: UpdateFooterLinkDto[];
}

class UpdateFooterSocialDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  url?: string;
}

export class UpdateFooterDto {
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @ValidateIf((o) => o.email != null && o.email !== '')
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  copyright?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFooterSocialDto)
  @IsOptional()
  socialLinks?: UpdateFooterSocialDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFooterSectionDto)
  @IsOptional()
  sections?: UpdateFooterSectionDto[];
}
