import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QueueService } from './queue.service';

const DISPATCH_INTERVAL_MS = 10000; // despacha un usuario cada 10 segundos

@WebSocketGateway({ cors: { origin: '*' } })
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Mapa de userId -> socketId para poder notificar al usuario correcto
  private userSockets = new Map<number, string>();

  private dispatchInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly queueService: QueueService) {
    this.startDispatchLoop();
  }

  private startDispatchLoop() {
    this.dispatchInterval = setInterval(async () => {
      const queueLength = await this.queueService.getQueueLength();
      if (queueLength === 0) return;

      const userId = await this.queueService.dispatchNext();
      if (!userId) return;

      const ttl = await this.queueService.getActiveTTL(userId);
      const socketId = this.userSockets.get(userId);

      // Notificar al usuario despachado
      if (socketId) {
        this.server.to(socketId).emit('your_turn', {
          message: '¡Es tu turno! Tenés 2 minutos para completar tu compra.',
          timeoutSeconds: ttl
        });
      }

      // Notificar a todos la actualización de la cola
      const newLength = await this.queueService.getQueueLength();
      this.server.emit('queue_update', { totalInQueue: newLength });

      // Actualizar posiciones de todos los usuarios en cola
      for (const [uid, sid] of this.userSockets.entries()) {
        const position = await this.queueService.getPosition(uid);
        if (position > 0) {
          this.server.to(sid).emit('queue_position', {
            position,
            estimatedWait: position * 30
          });
        }
      }
    }, DISPATCH_INTERVAL_MS);
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    // Limpiar el mapa cuando el usuario se desconecta
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register_user')
  handleRegisterUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number }
  ) {
    this.userSockets.set(data.userId, client.id);
  }

  @SubscribeMessage('join_queue')
  async handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number }
  ) {
    this.userSockets.set(data.userId, client.id);
    const result = await this.queueService.joinQueue(data.userId);
    client.emit('queue_position', result);

    const queueLength = await this.queueService.getQueueLength();
    this.server.emit('queue_update', { totalInQueue: queueLength });

    return result;
  }

  @SubscribeMessage('leave_queue')
  async handleLeaveQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number }
  ) {
    await this.queueService.leaveQueue(data.userId);
    this.userSockets.delete(data.userId);
    client.emit('queue_left', { message: 'Saliste de la cola' });

    const queueLength = await this.queueService.getQueueLength();
    this.server.emit('queue_update', { totalInQueue: queueLength });
  }

  @SubscribeMessage('clear_queue')
  async handleClearQueue(@ConnectedSocket() client: Socket) {
    await this.queueService.clearQueue();
    this.userSockets.clear();
    const queueLength = await this.queueService.getQueueLength();
    this.server.emit('queue_update', { totalInQueue: queueLength });
    client.emit('queue_cleared', { message: 'Cola limpiada' });
  }

  @SubscribeMessage('simulate_load')
  async handleSimulateLoad(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userCount: number }
  ) {
    await this.queueService.simulateLoad(data.userCount);
    const queueLength = await this.queueService.getQueueLength();
    this.server.emit('queue_update', { totalInQueue: queueLength });
    client.emit('simulation_done', { totalInQueue: queueLength });
  }
}