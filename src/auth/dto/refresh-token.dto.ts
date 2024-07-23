import { IsString } from 'class-validator';

interface User {
  id: string;
  name: string;
  email: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;

  user: User;
}
