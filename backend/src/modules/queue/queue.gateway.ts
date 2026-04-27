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

@WebSocketGateway({ cors: { origin: '*' } })
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly queueService: QueueService) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('join_queue')
  async handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number }
  ) {
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
    client.emit('queue_left', { message: 'Saliste de la cola' });

    const queueLength = await this.queueService.getQueueLength();
    this.server.emit('queue_update', { totalInQueue: queueLength });
  }

  @SubscribeMessage('clear_queue')
async handleClearQueue(@ConnectedSocket() client: Socket) {
  await this.queueService.clearQueue();
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