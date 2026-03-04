import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; address: string; maxCapacity: number }) {
    return this.prisma.location.create({
      data: {
        name: data.name,
        address: data.address,
        maxCapacity: data.maxCapacity,
      },
    });
  }

  async findAll() {
    return this.prisma.location.findMany();
  }
}
