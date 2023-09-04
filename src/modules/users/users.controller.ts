import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { LogMethod } from 'src/common/typeorm/logging.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post()
  @LogMethod()
  create(@Body() body) {
    return this._usersService.createOne(body);
  }
}
