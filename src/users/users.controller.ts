import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
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

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(@Param('id') userId: string) {
    return await this.usersService.getUserInfo(userId);
  }
}
