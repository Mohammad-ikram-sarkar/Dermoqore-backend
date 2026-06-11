import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  ValidateNested,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateFooterLinkDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  href: string;
}

class CreateFooterSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFooterLinkDto)
  @IsOptional()
  links?: CreateFooterLinkDto[];
}

class CreateFooterSocialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateFooterDto {
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
  @Type(() => CreateFooterSocialDto)
  @IsOptional()
  socialLinks?: CreateFooterSocialDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFooterSectionDto)
  @IsOptional()
  sections?: CreateFooterSectionDto[];
}
