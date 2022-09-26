import request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

describe('Orders', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an order', async () => {
    const order = {
      customerId: '456',
      companyId: '789',
    };

    // Create an order
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(order)
      .expect(201);

    expect(response.body.orderId).toBeTruthy();

    // Delete the order events
    const orderId = response.body.orderId;
    await request(app.getHttpServer())
      .delete(`/orders`)
      .send({ orderId, ...order })
      .expect(200);

    // Get the order
    const getOrdersResponse = await request(app.getHttpServer())
      .get(
        `/orders?orderId=${orderId}&customerId=${order.customerId}&companyId=${order.companyId}`,
      )
      .expect(200);

    expect(getOrdersResponse.body.orderId).toEqual(orderId);
    expect(getOrdersResponse.body.events.length).toBe(0);
  });
});
