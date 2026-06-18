import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['INSIDE_DHAKA', 'OUTSIDE_DHAKA'])
  zone: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
