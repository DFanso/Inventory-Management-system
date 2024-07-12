import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { UsersModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), UsersModule, ClsModule],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
