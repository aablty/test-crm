import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthPayloadDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email!: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  password!: string;
}
