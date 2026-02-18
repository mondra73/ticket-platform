import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello() {
    const sector = await this.prisma.sector.create({
      data: {
        name: 'VIP',
        price: 500,
        totalStock: 100,
      },
    });

    return sector;
  }
}
