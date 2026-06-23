import {
  IsArray,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuestOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class PlaceGuestOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestOrderItemDto)
  items: GuestOrderItemDto[];

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['INSIDE_DHAKA', 'OUTSIDE_DHAKA'])
  deliveryZone: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
