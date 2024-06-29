import { Injectable } from '@nestjs/common';
import { UserInfo } from './models/UserInfo';

@Injectable()
export class UsersService {
  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    await this.saveUser(name, email, password);
  }

  private checkUserExists(email: string) {
    return false;
  }

  private saveUser(name: string, email: string, password: string) {
    return;
  }

  async login(email: string, password: string): Promise<string> {
    throw new Error('Method not implemented');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('Method not implemented');
  }
}
