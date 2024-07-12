import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signJwt(user: any): Promise<string> {
    if (!user || !user.email || !user._id) {
      throw new Error('Invalid user data for JWT signing.');
    }
    const payload = { username: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async signUp(userDetails: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findOne({
      email: userDetails.email,
    });
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.usersService.create(userDetails);
    return user;
  }

  async signIn(
    signInDto: LoginDto,
  ): Promise<{ user: any; accessToken: string } | null> {
    const user = await this.usersService.findOne({ email: signInDto.email });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    if (user.isActive == false) {
      throw new UnauthorizedException('User is Inactive!');
    }

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      accessToken,
    };
  }
}
