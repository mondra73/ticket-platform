import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto, @Request() req: any) {
    return this.orderService.create(req.user.id, dto);
  }

  @Get('my-orders')
  findMyOrders(@Request() req: any) {
    return this.orderService.findByUser(req.user.id);
  }
}
