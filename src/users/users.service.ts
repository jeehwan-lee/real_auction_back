import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserInfo } from './models/UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);

    if (userExist) {
      throw new UnprocessableEntityException('이미 가입된 이메일입니다.');
    }

    await this.saveUser(name, email, password);
  }

  private async checkUserExists(emailAddress: string) {
    const user = await this.userRepository.findOne({
      where: { email: emailAddress },
    });

    return user != undefined;
  }

  private async saveUser(name: string, email: string, password: string) {
    const user = new UserEntity();
    user.id = uuid.v1();
    user.name = name;
    user.email = email;
    user.password = password;

    await this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<string> {
    throw new Error('Method not implemented');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('Method not implemented');
  }
}
