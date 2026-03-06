import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async process(userId: number, dto: ProcessPaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { items: true }
    });

    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.userId !== userId) throw new BadRequestException('Esta orden no te pertenece');
    if (order.status !== 'PENDING') throw new BadRequestException(`La orden ya tiene estado: ${order.status}`);
    if (new Date() > order.expiresAt) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'EXPIRED' }
      });
      throw new BadRequestException('La orden expiró. El tiempo de compra venció');
    }

    const approved = this.simulatePayment(dto.cardNumber);

    if (!approved) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      });
      return {
        success: false,
        message: 'Pago rechazado. Tarjeta denegada por el simulador'
      };
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
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

    return {
      success: true,
      message: 'Pago aprobado',
      order: updatedOrder
    };
  }

  private simulatePayment(cardNumber: string): boolean {
    if (cardNumber.startsWith('0000')) return false;
    return Math.random() > 0.1;
  }
}
