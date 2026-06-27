//src/auth/auth.controller.ts

import { Body, Controller, Get, Post, UseGuards, HttpException, Req, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
  ResetPasswordReqDto,
} from './dto/login.dto';
import { ResponseDto } from '../utils/response.dto';
import { UserDTO } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthUserJWT } from '../utils/auth-user-jwt.decorator';
import { AuthResponseDto } from './dto/auth-resp.dto';
import { CreateTransporterDto } from '../transporters/dto/create-transporter.dto';
import { USERROLES } from '../utils/enum';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    description: 'login response',
    type: AuthResponseDto,
    isArray: false,
  })
  login(@Body() { email, password }: LoginDto): Promise<ResponseDto> {
    return this.authService.login(email, password);
  }

@Post('register')
@ApiOkResponse({
  description: 'login response',
  type: AuthResponseDto,
  isArray: false,
})
register(@Body() user: UserDTO): Promise<ResponseDto> {
  return this.authService.register(user);
}
  @Post('verify-email')
  @ApiOkResponse({ description: 'Verify email with code' })
  verifyEmail(
  @Body() body: { email: string; code: string },): Promise<any> {
  return this.authService.verifyEmail(body);
}

  @Get('google')
  async googleLogin(@Req() req: any, @Res() res: any) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new HttpException('Google login is not configured', 500);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://samlogistic.tn';
    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/auth/google/callback`;

    const authUrl =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'email profile',
        access_type: 'offline',
        prompt: 'consent',
      }).toString();

    res.redirect(authUrl);
  }

  @Get('google/callback')
  async googleCallback(@Req() req: any, @Res() res: any, @Query() query: any) {
    if (!query.code) {
      throw new HttpException('Missing Google authorization code', 400);
    }

    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/auth/google/callback`;
    const frontendUrl = process.env.FRONTEND_URL || 'https://samlogistic.tn';
    const result = await this.authService.loginWithGoogle(query.code, callbackUrl);
    const returnUrl = `${frontendUrl}/login`;
    const params = new URLSearchParams({
      google_access_token: result.accessToken,
      google_refresh_token: result.refreshToken,
      google_user: JSON.stringify(result.user),
    });

    res.redirect(`${returnUrl}?${params.toString()}`);
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'login response',
    type: AuthResponseDto,
    isArray: false,
  })
  refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken);
  }

@Post('admin/create-transporter')
@UseGuards(JwtAuthGuard)
async createTransporter(@Body() dto: CreateTransporterDto, @Req() req: any) {
  if (![USERROLES.admin.id, USERROLES.superadmin.id].includes(req.user.roleId)) {
    throw new HttpException('Accès admin seulement', 403);
  }
  return this.authService.createTransporterByAdmin(dto);
}

  @Post('request-reset-password-email')
  @ApiOkResponse({
    description: 'Request reset password',
    type: ResetPasswordDto,
    isArray: false,
  })
  requestPasswordReset(@Body() data: ResetPasswordReqDto): Promise<boolean> {
    return this.authService.requestPasswordReset(data?.email);
  }

  @Post('reset-password')
  @ApiOkResponse({
    description: 'Reset password',
    type: ResetPasswordDto,
    isArray: false,
  })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<boolean> {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'get authenticated user data',
    type: AuthResponseDto,
    isArray: false,
  })
  getAuthenticatedUser(@AuthUserJWT() jwt: string | undefined): Promise<any> {
    return this.authService.getAuthUser(jwt);
  }
  @Get('admin/transporters')
@UseGuards(JwtAuthGuard)
async getAdminTransporters(@Req() req: any) {
  if (![USERROLES.admin.id, USERROLES.superadmin.id].includes(req.user.roleId)) {
    throw new HttpException('Admin seulement', 403);
  }
  
  return this.authService.getAdminTransporters();
}

}
