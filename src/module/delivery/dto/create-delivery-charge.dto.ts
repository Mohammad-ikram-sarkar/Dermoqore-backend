import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateDeliveryChargeDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['INSIDE_DHAKA', 'OUTSIDE_DHAKA'])
  zone: string;

  @IsNumber()
  @IsNotEmpty()
  charge: number;

  @IsNumber()
  @IsOptional()
  minOrder?: number;
}
