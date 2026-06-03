import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { JwtPayload } from '../auth/jwt.strategy';
import { TaskStatus } from './dto/tasks.dto';

export type TaskRealtimeDto = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskStatusChangedEvent = {
  id: string;
  status: TaskStatus;
  timestamp: string;
};

export type TaskDeletedEvent = {
  id: string;
  timestamp: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TasksGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(TasksGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    const token = this.getToken(client);

    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      await client.join(this.getUserRoom(payload.sub));
    } catch {
      this.logger.warn('Rejected websocket connection with invalid token');
      client.disconnect(true);
    }
  }

  emitTaskCreated(userId: string, task: TaskRealtimeDto) {
    this.server.to(this.getUserRoom(userId)).emit('task.created', task);
  }

  emitTaskUpdated(userId: string, task: TaskRealtimeDto) {
    this.server.to(this.getUserRoom(userId)).emit('task.updated', task);
  }

  emitTaskDeleted(userId: string, event: TaskDeletedEvent) {
    this.server.to(this.getUserRoom(userId)).emit('task.deleted', event);
  }

  emitStatusChanged(userId: string, event: TaskStatusChangedEvent) {
    this.server.to(this.getUserRoom(userId)).emit('task.statusChanged', event);
  }

  private getToken(client: Socket) {
    const auth = client.handshake.auth as { token?: unknown };
    if (typeof auth.token === 'string') return auth.token;

    const header = client.handshake.headers.authorization;
    if (!header?.startsWith('Bearer ')) return null;

    return header.slice('Bearer '.length);
  }

  private getUserRoom(userId: string) {
    return `user:${userId}`;
  }
}
