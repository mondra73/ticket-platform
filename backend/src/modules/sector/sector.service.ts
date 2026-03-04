import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SectorService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    price: number;
    totalStock: number;
    eventId: number;
  }) {
    return this.prisma.sector.create({
      data: {
        name: data.name,
        price: data.price,
        totalStock: data.totalStock,
        eventId: data.eventId, // ⚠️ ahora es number directo
      },
    });
  }

  async findAll() {
    return this.prisma.sector.findMany({
      include: {
        event: true,
      },
    });
  }

  async findByEvent(eventId: number) {
    return this.prisma.sector.findMany({
      where: { eventId },
    });
  }
}
