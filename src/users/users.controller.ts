import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-all-users')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('get-user-by-id/:id')
  @UseGuards(AuthGuard('jwt'))
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }
}
