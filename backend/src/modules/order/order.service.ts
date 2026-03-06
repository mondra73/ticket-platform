import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Sector } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

type ItemData = { sector: Sector; quantity: number };

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const itemsData: ItemData[] = [];

      for (const item of dto.items) {
        const sector = await tx.sector.findUnique({
          where: { id: item.sectorId }
        });

        if (!sector) throw new NotFoundException(`Sector ${item.sectorId} no encontrado`);

        const available = sector.totalStock - sector.soldStock;
        if (available < item.quantity) {
          throw new BadRequestException(`Stock insuficiente en sector ${sector.name}. Disponibles: ${available}`);
        }

        totalAmount += sector.price * item.quantity;
        itemsData.push({ sector, quantity: item.quantity });
      }

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          expiresAt,
          items: {
            create: itemsData.map((i) => ({
              sectorId: i.sector.id,
              quantity: i.quantity,
              unitPrice: i.sector.price,
              tickets: {
                create: Array.from({ length: i.quantity }, () => ({
                  qrCode: uuidv4()
                }))
              }
            }))
          }
        },
        include: {
          items: {
            include: { tickets: true }
          }
        }
      });

      for (const item of itemsData) {
        await tx.sector.update({
          where: { id: item.sector.id },
          data: { soldStock: { increment: item.quantity } }
        });
      }

      return order;
    });
  }

  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            sector: {
              include: { event: true }
            },
            tickets: true
          }
        }
      }
    });
  }
}
