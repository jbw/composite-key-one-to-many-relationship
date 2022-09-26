import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getOrder(
    @Query('customerId') customerId: string,
    @Query('companyId') companyId: string,
    @Query('orderId') orderId: string,
  ) {
    return this.appService.getOrder(orderId, customerId, companyId);
  }

  @Post()
  async createOrder(
    @Body('customerId') customerId: string,
    @Body('companyId') companyId: string,
  ) {
    return this.appService.createOrder(customerId, companyId);
  }

  @Delete()
  async deleteOrders(
    @Body('customerId') customerId: string,
    @Body('companyId') companyId: string,
    @Body('orderId') orderId: string,
  ) {
    return this.appService.deleteOrderEvents(orderId, customerId, companyId);
  }
}
