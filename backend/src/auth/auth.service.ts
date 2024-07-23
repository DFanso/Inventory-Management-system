import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async signIn(
    signInDto: LoginDto,
  ): Promise<{ user: any; accessToken: string } | null> {
    const cacheKey = `user:${signInDto.email}`;
    const cachedUser = await this.redis.get(cacheKey);
    let user;

    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await this.usersService.findOneWithPassword({
        email: signInDto.email,
      });
      if (user) {
        await this.redis.set(cacheKey, JSON.stringify(user), 'EX', 3600); // cache for 1 hour
      }
    }

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
