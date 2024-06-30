import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserInfo } from './models/UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
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

  async login(email: string, password: string): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    const token = await this.authService.getUserToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token,
    };
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
