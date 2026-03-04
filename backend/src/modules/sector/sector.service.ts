import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SectorService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    price: number;
    totalStock: number;
  }) {
    return this.prisma.sector.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.sector.findMany();
  }
}