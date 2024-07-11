import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { ClsService } from 'nestjs-cls';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly clsService: ClsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'The user', type: User })
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The created user', type: User })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiResponse({ status: 200, description: 'The updated user', type: User })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }

  @Patch(':id/disable')
  @ApiOperation({ summary: 'Disable a user' })
  @ApiParam({ name: 'id', description: 'ID of the user to disable' })
  @ApiResponse({ status: 200, description: 'User disabled successfully' })
  disable(@Param('id') id: number): Promise<void> {
    return this.usersService.disable(id);
  }
}
