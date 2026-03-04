import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello() {
    // 1. Crear location
    const location = await this.prisma.location.create({
      data: {
        name: 'Estadio Principal',
        address: 'Av. Principal 123',
        maxCapacity: 50000
      }
    });

    // 2. Crear event (sin createdAt porque se auto-genera)
    const event = await this.prisma.event.create({
      data: {
        name: 'Evento de Prueba',
        startDate: new Date('2024-12-31'),
        locationId: location.id
      }
    });

    // 3. Crear sector
    const sector = await this.prisma.sector.create({
      data: {
        name: 'VIP',
        price: 500,
        totalStock: 100,
        eventId: event.id
      }
    });

    return {
      message: 'Todo creado exitosamente',
      location,
      event,
      sector
    };
  }
}