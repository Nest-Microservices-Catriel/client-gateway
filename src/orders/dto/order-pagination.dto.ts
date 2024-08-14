import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';
import { OrderStatus } from '../enum/order-status.enum';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Possible status values are: ${OrderStatus.CANCELLED}, ${OrderStatus.PENDING} ${OrderStatus.DELIVERED}`,
  })
  status: OrderStatus;
}
