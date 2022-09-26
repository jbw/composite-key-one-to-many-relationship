import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './order.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: EntityRepository<Order>,
  ) {}

  async getOrder(orderId: string, customerId: string, companyId: string) {
    const order = await this.repo.findOne(
      { customerId, companyId, orderId },
      { populate: true },
    );

    if (!order) {
      return new NotFoundException(`Order ${orderId} not found`);
    }

    return order;
  }

  async createOrder(customerId: string, companyId: string) {
    const order = Order.create({
      customerId,
      companyId,
    });

    order.addEvent('created');
    order.addEvent('pending');

    await this.repo.persistAndFlush(order);
    return { orderId: order.orderId };
  }

  async deleteOrderEvents(
    orderId: string,
    customerId: string,
    companyId: string,
  ) {
    const order = await this.repo.findOne(
      { customerId, companyId, orderId },
      { populate: true },
    );

    if (!order) {
      return new NotFoundException(`Order ${orderId} not found`);
    }

    if (order) {
      order.events.removeAll();
      await this.repo.persistAndFlush(order);
    }
  }
}
