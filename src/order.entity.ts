import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

import { OrderEvent } from './order-event.entity';

@Entity()
export class Order {
  @PrimaryKey()
  orderId: string = uuidv4();

  @PrimaryKey()
  customerId: string;

  @PrimaryKey()
  companyId: string;

  @OneToMany(() => OrderEvent, (orderEvent) => orderEvent.order, {
    orphanRemoval: true,
  })
  events = new Collection<OrderEvent>(this);

  static create({
    customerId,
    companyId,
  }: {
    customerId: string;
    companyId: string;
  }) {
    const order = new Order();
    order.customerId = customerId;
    order.companyId = companyId;

    return order;
  }

  addEvent(name: string) {
    this.events.add(OrderEvent.create(name));
  }
}
