import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; startDate: Date; locationId: number }) {
    return this.prisma.event.create({
      data: {
        name: data.name,
        startDate: data.startDate, // <-- Antes decía 'date'
        locationId: data.locationId,
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      include: {
        location: true,
      },
    });
  }
}
