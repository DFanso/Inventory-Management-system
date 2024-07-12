import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { AuthGuard } from '@nestjs/passport';
import { AppClsStore, UserRole } from 'src/Types/users.types';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ClsService } from 'nestjs-cls';
import { UsersService } from 'src/users/users.service';

@ApiTags('items')
@Controller({ path: 'items', version: '1' })
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'List of all items', type: [Item] })
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the item' })
  @ApiResponse({ status: 200, description: 'The item', type: Item })
  async findOne(@Param('id') id: number): Promise<Item> {
    const item = await this.itemsService.findOne(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'The created item', type: Item })
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new NotFoundException('User not found');
    }
    const UserId = parseInt(context.user.id, 10);
    const user = await this.usersService.findOne({ id: UserId });
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    return this.itemsService.create(createItemDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({ name: 'id', description: 'ID of the item to update' })
  @ApiResponse({ status: 200, description: 'The updated item', type: Item })
  async update(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new NotFoundException('User not found');
    }
    const UserId = parseInt(context.user.id, 10);
    const user = await this.usersService.findOne({ id: UserId });
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    const item = await this.itemsService.findOne(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return this.itemsService.update(id, updateItemDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({ name: 'id', description: 'ID of the item to delete' })
  @ApiResponse({ status: 204, description: 'Item deleted successfully' })
  async remove(@Param('id') id: number): Promise<void> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new NotFoundException('User not found');
    }
    const UserId = parseInt(context.user.id, 10);
    const user = await this.usersService.findOne({ id: UserId });

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    const item = await this.itemsService.findOne(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return this.itemsService.remove(id);
  }
}
