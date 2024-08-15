import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';

import { catchError, firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto, StatusDto } from './dto';

import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  //! ENDPOINTS
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const response = await firstValueFrom(
        this.natsClient.send('createOrder', createOrderDto),
      );
      return response;
    } catch (error) {
      console.log(error);

      throw new RpcException(error);
    }
  }

  @Get()
  async getOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(
        this.natsClient.send('findAllOrders', orderPaginationDto),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('/status/:status')
  getOrdersStatus(
    @Query() paginationDto: PaginationDto,
    @Param() statusDto: StatusDto,
  ) {
    try {
      return this.natsClient.send('findAllOrders', {
        ...paginationDto,
        ...statusDto,
      });
    } catch (error) {
      throw new RpcException(error);
    }
    // return this.orderClient.send('findAllOrders', orderPaginationDto);
  }

  @Get('/id/:id')
  getOrderById(@Param('id', ParseUUIDPipe) id: string) {
    return this.natsClient.send('findOneOrder', { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  async changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      const order = await firstValueFrom(
        this.natsClient.send('changeOrderStatus', { id, ...statusDto }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
