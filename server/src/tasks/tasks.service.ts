import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskStatus } from './dto/tasks.dto';
import { TasksGateway, TaskRealtimeDto } from './tasks.gateway';

type TaskEntity = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  async getAll(userId: string) {
    return this.prisma.task.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, _dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        authorId: userId,
        ..._dto,
      },
    });

    this.tasksGateway.emitTaskCreated(userId, this.toRealtimeDto(task));

    return task;
  }

  async update(userId: string, taskId: string, _dto: UpdateTaskDto) {
    const task = await this.findUserTask(userId, taskId, 'update');
    const oldStatus = String(task.status);
    const nextStatus = _dto.status ? String(_dto.status) : undefined;

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: _dto,
    });

    const realtimeTask = this.toRealtimeDto(updated);

    this.tasksGateway.emitTaskUpdated(userId, realtimeTask);

    if (nextStatus && nextStatus !== oldStatus) {
      this.tasksGateway.emitStatusChanged(userId, {
        id: updated.id,
        status: _dto.status as TaskStatus,
        timestamp: realtimeTask.updatedAt,
      });
    }

    return updated;
  }

  async delete(userId: string, taskId: string) {
    await this.findUserTask(userId, taskId, 'delete');

    const deleted = await this.prisma.task.delete({ where: { id: taskId } });

    this.tasksGateway.emitTaskDeleted(userId, {
      id: deleted.id,
      timestamp: new Date().toISOString(),
    });

    return deleted;
  }

  private async findUserTask(
    userId: string,
    taskId: string,
    action: 'update' | 'delete',
  ) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    });

    if (!task) throw new BadRequestException('Задача не найдена');

    if (task.authorId !== userId) {
      const message =
        action === 'update'
          ? 'Нет прав на изменение этой задачи'
          : 'Нет прав на удаление этой задачи';
      throw new BadRequestException(message);
    }

    return task;
  }

  private toRealtimeDto(task: TaskEntity): TaskRealtimeDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: String(task.status) as TaskStatus,
      authorId: task.authorId,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
