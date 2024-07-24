import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { UsersService } from '../users/users.service';
import { UserRole } from 'src/Types/users.types';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async onModuleInit() {
    const host = this.configService.getOrThrow('MYSQL_HOST');
    const port = this.configService.getOrThrow('MYSQL_PORT');
    const username = this.configService.getOrThrow('MYSQL_USERNAME');
    const password = this.configService.getOrThrow('MYSQL_PASSWORD');
    const dbName = this.configService.getOrThrow('MYSQL_DATABASE');

    const connection = await mysql.createConnection({
      host,
      port,
      user: username,
      password,
    });

    try {
      // Create the database if it doesn't exist
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      console.log(`Database "${dbName}" created or already exists.`);

      // Close the initial connection
      await connection.end();

      // Create a new connection to the specific database
      const dbConnection = await mysql.createConnection({
        host,
        port,
        user: username,
        password,
        database: dbName,
      });

      // Create the users table if it doesn't exist
      await dbConnection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('VIEWER', 'ADMIN') DEFAULT 'VIEWER',
          isActive BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Table "users" created or already exists.');
      await dbConnection.end();

      // Check if the default user exists before creating it
      const existingUser = await this.usersService.findOne({
        email: 'dfanso@pm.me',
      });
      if (!existingUser) {
        const defaultUser = {
          name: 'Leo Gavin',
          email: 'dfanso@pm.me',
          password: '123@Dfanso',
          role: UserRole.ADMIN,
          isActive: true,
        };
        await this.usersService.create(defaultUser);
        console.log('Default user created.');
      } else {
        console.log('Default user already exists.');
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
}
