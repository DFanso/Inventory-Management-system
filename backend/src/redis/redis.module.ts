import { Module } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => ({
        type: 'single',
        url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RedisModule],
})
export class RedisConfigModule {}
