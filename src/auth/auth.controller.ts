import { Body, Controller, Delete, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, SignupDto } from './dto/auth.dto';
import { ApiResponse, Permission } from '../common/decorators';
import { ProtectedRequest } from '../types/app-request';
import { AuthGuard } from '../common/guards';
import { getAccessToken, PermissionEnum } from '../common/helpers';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Permission(PermissionEnum.GENERAL)
  @ApiResponse({ key: 'auth.success.login' }, HttpStatus.OK)
  async login(@Body() inputs: LoginDto) {
    return this.authService.login(inputs);
  }

  @Post('signup')
  @Permission(PermissionEnum.GENERAL)
  @ApiResponse({ key: 'auth.success.signup' }, HttpStatus.OK)
  async signup(@Body() inputs: SignupDto) {
    return this.authService.signup(inputs);
  }

  @Delete('logout')
  @Permission(PermissionEnum.GENERAL)
  @UseGuards(AuthGuard)
  @ApiResponse({ key: 'auth.success.logout' })
  async logout(@Req() req: ProtectedRequest) {
    return this.authService.logout(req.keystore);
  }

  @Post('refresh')
  @Permission(PermissionEnum.GENERAL)
  @UseGuards(AuthGuard)
  @ApiResponse({ key: 'auth.success.token_issued' }, HttpStatus.OK)
  async refresh(@Req() req: ProtectedRequest, @Body() inputs: RefreshTokenDto) {
    const accessToken = getAccessToken(req.headers.authorization);
    return this.authService.refresh(accessToken, inputs.refresh_token);
  }
}
