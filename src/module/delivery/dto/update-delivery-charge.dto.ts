import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class UpdateDeliveryChargeDto {
  @IsString()
  @IsOptional()
  @IsIn(['INSIDE_DHAKA', 'OUTSIDE_DHAKA'])
  zone?: string;

  @IsNumber()
  @IsOptional()
  charge?: number;

  @IsNumber()
  @IsOptional()
  minOrder?: number;
}
