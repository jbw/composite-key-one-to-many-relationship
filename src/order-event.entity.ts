import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Order } from './order.entity';

@Entity()
export class OrderEvent {
  @PrimaryKey()
  orderEventId: string = uuidv4();

  @Property()
  name: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => Order, { primary: true })
  order!: Order;

  static create(name: string) {
    const product = new OrderEvent();
    product.name = name;

    return product;
  }
}
