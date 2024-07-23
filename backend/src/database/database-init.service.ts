import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

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
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
      console.log(`Database "${dbName}" created or already exists.`);
    } catch (error) {
      console.error('Failed to create database:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
}
