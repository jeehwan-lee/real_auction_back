import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './models/UserInfo';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.createUser(createUserDto);
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<UserInfo> {
    return await this.usersService.login(userLoginDto);
  }

  @Get('/checkUserEmailExist/:email')
  async getUserByEmail(@Param('email') email: string) {
    const result = await this.usersService.checkUserEmailExist(email);
    return result;
  }

  @Get('/checkUserNameExist/:name')
  async getUserByName(@Param('name') name: string) {
    const result = await this.usersService.checkUserNameExist(name);
    return result;
  }

  @Get('/:id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    const jwtString = headers.authorization.split('Bearer ')[1];

    this.authService.verify(jwtString);

    return await this.usersService.getUserInfo(userId);
  }
}
