import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import databaseOptions from '../mikro-orm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Order } from './order.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot({ ...databaseOptions }),
    MikroOrmModule.forFeature([Order]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
