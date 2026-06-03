import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { Public } from './decorators/public';
import { CurrentUser } from './decorators/current-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: AuthPayloadDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: AuthPayloadDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  profile(@CurrentUser() userId: string) {
    return this.authService.getProfile(userId);
  }
}
