import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SectorModule } from './modules/sector/sector.module';
import { EventModule } from './modules/event/event.module';
import { LocationModule } from './modules/location/location.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { QueueModule } from './modules/queue/queue.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL ?? 'redis://localhost:6379'
    }),
    PrismaModule,
    SectorModule,
    EventModule,
    LocationModule,
    AuthModule,
    OrderModule,
    PaymentModule,
    QueueModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}