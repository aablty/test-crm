import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import type { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(_dto: AuthPayloadDto) {
    const hash = await bcrypt.hash(_dto.password, 10);

    if (await this.users.findByEmail(_dto.email)) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const user = await this.users.create(_dto.email, hash);

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return this.signToken(payload);
  }

  async login(_dto: AuthPayloadDto) {
    const user = await this.validateUser(_dto.email, _dto.password);

    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return this.signToken(payload);
  }

  private async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }

  private async signToken(payload: JwtPayload) {
    return {
      access_token: await this.jwt.signAsync(payload),
    };
  }
}
