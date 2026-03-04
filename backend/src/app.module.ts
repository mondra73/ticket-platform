import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SectorModule } from './modules/sector/sector.module';

@Module({
  imports: [PrismaModule, SectorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
