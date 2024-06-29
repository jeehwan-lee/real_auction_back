import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, 'SCRETKEY', {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }
}
