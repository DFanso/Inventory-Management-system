import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: number): Promise<Item | null> {
    return this.itemsRepository.findOne({ where: { id } });
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemDto);
    return this.itemsRepository.save(newItem);
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    await this.itemsRepository.update(id, updateItemDto);
    return this.itemsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.itemsRepository.delete(id);
  }
}
