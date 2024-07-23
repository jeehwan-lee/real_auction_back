import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

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
}
