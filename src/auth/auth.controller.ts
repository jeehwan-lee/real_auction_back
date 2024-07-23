import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/accessToken')
  async getAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const newAccessToken =
      await this.authService.getAccessTokenByRefreshToken(refreshTokenDto);

    if (!newAccessToken) {
      throw new UnauthorizedException();
    }

    return { accessToken: newAccessToken };
  }
}
