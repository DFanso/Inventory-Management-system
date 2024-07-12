import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const fields = Object.keys(
      this.usersRepository.metadata.propertiesMap,
    ).filter((key) => key !== 'password') as (keyof User)[];

    return this.usersRepository.find({
      select: fields,
    });
  }

  async findOne(filter: FindOptionsWhere<User>): Promise<User | null> {
    const fields = Object.keys(
      this.usersRepository.metadata.propertiesMap,
    ).filter((key) => key !== 'password') as (keyof User)[];

    return this.usersRepository.findOne({
      where: filter,
      select: fields,
    });
  }

  async create(user: Partial<User>): Promise<any> {
    const newUser = this.usersRepository.create(user);
    this.usersRepository.save(newUser);
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

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async status(id: number, status: boolean): Promise<void> {
    await this.usersRepository.update(id, { isActive: status });
  }
}
