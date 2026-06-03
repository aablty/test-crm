import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from '../auth/decorators/current-user';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  get() {
    return this.tasks.getAll();
  }

  @Post()
  create(@CurrentUser() userId: string, @Body() dto: CreateTaskDto) {
    return this.tasks.create(userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() userId: string,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(userId, taskId, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() userId: string, @Param('id') taskId: string) {
    return this.tasks.delete(userId, taskId);
  }
}
