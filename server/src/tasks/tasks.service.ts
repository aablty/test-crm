import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.task.findMany();
  }

  async create(userId: string, _dto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: {
        authorId: userId,
        ..._dto,
      },
    });
  }

  async update(userId: string, taskId: string, _dto: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    });

    if (!task) {
      throw new BadRequestException('Задача не найдена');
    }

    if (task.authorId !== userId) {
      throw new BadRequestException('Нет прав на изменение этой задачи');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: _dto,
    });
  }

  async delete(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    });

    if (!task) {
      throw new BadRequestException('Задача не найдена');
    }

    if (task.authorId !== userId) {
      throw new BadRequestException('Нет прав на удаление этой задачи');
    }

    return this.prisma.task.delete({ where: { id: taskId } });
  }
}
