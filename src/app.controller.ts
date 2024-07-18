import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthy')
  async getHealthy(@Res() res: Response) {
    return { message: 'This is a 200 response' };
  }
}
