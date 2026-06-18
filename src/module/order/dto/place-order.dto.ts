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

export class PlaceOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class PlaceOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemDto)
  items: PlaceOrderItemDto[];

  @IsString()
  @IsNotEmpty()
  shippingAddressId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['INSIDE_DHAKA', 'OUTSIDE_DHAKA'])
  deliveryZone: string;
}
