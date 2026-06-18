import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ])
  status: string;
}
