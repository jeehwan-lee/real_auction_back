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
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    const userEmailExist = await this.checkUserEmailExist(email);
    const userNameExist = await this.checkUserNameExist(name);

    if (userEmailExist) {
      throw new UnprocessableEntityException('이미 가입된 이메일입니다.');
    }

    if (userNameExist) {
      throw new UnprocessableEntityException('이미 사용중인 닉네임입니다.');
    }

    await this.saveUser(name, email, password);
  }

  async checkUserEmailExist(emailAddress: string) {
    const user = await this.userRepository.findOne({
      where: { email: emailAddress },
    });

    return user != undefined;
  }

  async checkUserNameExist(name: string) {
    const user = await this.userRepository.findOne({
      where: { name: name },
    });

    return user != undefined;
  }

  async saveUser(name: string, email: string, password: string) {
    const user = new UserEntity();
    user.name = name;
    user.email = email;
    user.password = password;
    user.photoUrl =
      'https://firebasestorage.googleapis.com/v0/b/lovetrip-83cb0.appspot.com/o/image%2Fprofile%2FprofileDefault.jpg?alt=media&token=2d79ded7-787c-4156-bdac-44ef1c9788c2';

    await this.userRepository.save(user);
  }

  async login(userLoginDto: UserLoginDto): Promise<UserInfo> {
    const { email, password } = userLoginDto;

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
      photoUrl: user.photoUrl,
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
      photoUrl: user.photoUrl,
    };
  }
}
