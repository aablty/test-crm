import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksGateway, TasksService],
})
export class TasksModule {}
