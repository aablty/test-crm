import { IsString, IsOptional, Length, IsEnum } from 'class-validator';

enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class CreateTaskDto {
  @IsString({ message: 'Заголовок должен быть строкой' })
  @Length(1, 255, { message: 'Заголовок должен быть от 1 до 255 символов' })
  title!: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  @Length(0, 1000, { message: 'Описание должно быть до 1000 символов' })
  description!: string;

  @IsEnum(TaskStatus, {
    message: 'Статус должен быть одним из: TODO, IN_PROGRESS, DONE',
  })
  @IsOptional()
  status!: TaskStatus;
}

export class UpdateTaskDto {
  @IsString({ message: 'Заголовок должен быть строкой' })
  @IsOptional()
  @Length(1, 255, { message: 'Заголовок должен быть от 1 до 255 символов' })
  title?: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  @Length(0, 1000, { message: 'Описание должно быть до 1000 символов' })
  description?: string;

  @IsEnum(TaskStatus, {
    message: 'Статус должен быть одним из: TODO, IN_PROGRESS, DONE',
  })
  @IsOptional()
  status?: TaskStatus;
}
