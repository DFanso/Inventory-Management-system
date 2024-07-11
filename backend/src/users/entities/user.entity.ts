import { Entity, Column, BeforeInsert } from 'typeorm';
import { AbstractEntity } from 'src/database/abstract.entity';
import { UserRole } from 'src/Types/users.types';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
