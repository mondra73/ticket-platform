import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SectorModule } from './modules/sector/sector.module';
import { EventModule } from './modules/event/event.module';
import { LocationModule } from './modules/location/location.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [PrismaModule, SectorModule, EventModule, LocationModule, AuthModule, OrderModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
