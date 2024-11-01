import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { ApiResponse } from '../common/decorators';
import { ProtectedRequest } from '../types/app-request';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ key: 'auth.success.login' })
  async login(@Body() inputs: LoginDto) {
    return this.authService.login(inputs);
  }

  @Post('signup')
  @ApiResponse({ key: 'auth.success.signup' })
  async signup(@Body() inputs: SignupDto) {
    return this.authService.signup(inputs);
  }

  @Post('logout')
  @ApiResponse({ key: 'auth.success.logout' })
  async logout(@Req() req: ProtectedRequest) {
    return this.authService.logout(req.keystore);
  }

  @Post('refresh')
  @ApiResponse({ key: 'auth.success.token_issued' })
  async refresh(@Req() req: ProtectedRequest) {
    return this.authService.refresh();
  }
}
