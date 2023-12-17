import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth-guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUser(@Param('id') id): Promise<User> {
    return this.usersService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update/:id')
  async updateUser(
    @Param('id') id,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async deleteUser(@Param('id') id): Promise<User> {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/pdf/:email')
  async generatePDF(@Param('email') email): Promise<any> {
    return this.usersService.generatePDF(email);
  }
}
