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
  NotFoundException,
  UseGuards,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { ClsService } from 'nestjs-cls';
import { AuthGuard } from '@nestjs/passport';
import { AppClsStore, UserRole } from 'src/Types/users.types';

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The created user', type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new NotFoundException('Admin User not found');
    }
    const UserId = parseInt(context.user.id, 10);
    const adminUser = await this.usersService.findOne({ id: UserId });
    if (!adminUser) {
      throw new NotFoundException('Admin User not found');
    }
    if (adminUser.role != UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    const user = await this.usersService.findOne({
      email: createUserDto.email,
    });
    if (user) {
      throw new ConflictException('User exist!');
    }
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiResponse({ status: 200, description: 'The updated user', type: User })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new NotFoundException('Admin User not found');
    }
    const UserId = parseInt(context.user.id, 10);
    const adminUser = await this.usersService.findOne({ id: UserId });
    if (!adminUser) {
      throw new NotFoundException('Admin User not found');
    }
    if (adminUser.role != UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    const user = await this.usersService.findOne({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async remove(@Param('id') id: number): Promise<void> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new NotFoundException('Admin User not found');
    }
    const UserId = parseInt(context.user.id, 10);
    const adminUser = await this.usersService.findOne({ id: UserId });
    if (!adminUser) {
      throw new NotFoundException('Admin User not found');
    }
    if (adminUser.role != UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    if (adminUser.id == id) {
      throw new ForbiddenException(
        'You are not authorized to delete your own account!',
      );
    }
    const user = await this.usersService.findOne({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update the status of a user' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @ApiParam({
    name: 'status',
    description: 'Status of the user',
    enum: ['true', 'false'],
  })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async status(
    @Param('id') id: number,
    @Param('status') status: boolean,
  ): Promise<void> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new NotFoundException('Admin User not found');
    }
    const UserId = parseInt(context.user.id, 10);
    const adminUser = await this.usersService.findOne({ id: UserId });
    if (!adminUser) {
      throw new NotFoundException('Admin User not found');
    }
    if (adminUser.role != UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const user = await this.usersService.findOne({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isActive == status) {
      throw new BadRequestException('User already has this status');
    }

    return this.usersService.status(id, status);
  }
}
