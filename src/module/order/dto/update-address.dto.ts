import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  @IsIn(['INSIDE_DHAKA', 'OUTSIDE_DHAKA'])
  zone?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
