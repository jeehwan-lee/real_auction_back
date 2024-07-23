import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  getUserAccessToken(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
  }

  getUserRefreshToken(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, process.env.JWT_SECRET_KEY) as (
        | jwt.JwtHeader
        | string
      ) &
        User;

      const { id, email } = payload;

      return { userId: id, email: email };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  getAccessTokenByRefreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      this.verify(refreshTokenDto.refreshToken);
      const newAccessToken = this.getUserAccessToken(refreshTokenDto.user);

      return newAccessToken;
    } catch {
      return null;
    }
  }
}
