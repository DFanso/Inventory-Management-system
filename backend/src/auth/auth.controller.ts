import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ConflictException,
  UnauthorizedException,
  UseGuards,
  HttpException,
  Get,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ClsService } from 'nestjs-cls';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AppClsStore } from 'src/Types/users.types';
import { User } from 'src/users/entities/user.entity';
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly clsService: ClsService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists.',
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.signUp(createUserDto);
      return { user };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User Already Exits');
      }
    }
    const user = await this.authService.signUp(createUserDto);
    return { user };
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  async signIn(@Body() signInDto: LoginDto) {
    const result = await this.authService.signIn(signInDto);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: "Get user's Profile" })
  @ApiResponse({ status: 200, description: 'The user', type: User })
  async profile(): Promise<any> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const UserId = parseInt(context.user.id, 10);
    console.log(context.user.id);
    const user = await this.usersService.findOne({ id: UserId });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }
}
