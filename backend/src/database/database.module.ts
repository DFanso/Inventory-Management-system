import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseInitService } from './database-init.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get('MYSQL_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseInitService],
  exports: [DatabaseInitService],
})
export class DatabaseModule {
  constructor(private readonly databaseInitService: DatabaseInitService) {}

  async onModuleInit() {
    await this.databaseInitService.onModuleInit();
  }
}
