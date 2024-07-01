import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  getUserToken(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, 'SECRETKEY', {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, 'SECRETKEY') as (
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
