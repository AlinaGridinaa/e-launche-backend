import { Controller, Post, Body, Res, HttpCode, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    
    console.log('Login successful for user:', result.user.email);
    
    // Повертаємо токен в response для збереження на frontend
    return {
      success: result.success,
      user: result.user,
      token: result.token, // Додано токен в response
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { success: true, message: 'Ви успішно вийшли' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request: Request & { user: any }) {
    console.log('Cookies received:', request.cookies);
    console.log('Token from cookie:', request.cookies?.token);
    return {
      success: true,
      user: request.user,
    };
  }
}
