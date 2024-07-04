import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserInfo } from './models/UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    return await this.saveUser(name, email, password);
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
    const encryptedPassword = bcrypt.hashSync(password, 10);

    user.name = name;
    user.email = email;
    user.password = encryptedPassword;
    user.photoUrl =
      'https://real-auction.s3.ap-southeast-2.amazonaws.com/image/profile/defaultImage';

    const createdUser = await this.userRepository.save(user);
    createdUser.password = undefined;

    return createdUser;
  }

  async login(userLoginDto: UserLoginDto): Promise<UserInfo> {
    const { email, password } = userLoginDto;

    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new NotFoundException('이메일과 비밀번호를 확인해주세요.');
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

  async updateUser(updateUserDto: UpdateUserDto) {
    const encryptedPassword = bcrypt.hashSync(updateUserDto.password, 10);

    const result = await this.userRepository.update(
      { email: updateUserDto.email },
      {
        name: updateUserDto.name,
        password: encryptedPassword,
        photoUrl: updateUserDto.photoUrl,
      },
    );

    if (result.affected != 1) {
      throw new UnprocessableEntityException('존재하지 않는 사용자입니다.');
    }

    return {
      name: updateUserDto.name,
      email: updateUserDto.email,
      photoUrl: updateUserDto.photoUrl,
    };
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return user;
  }
}
