import { Entity, Column } from 'typeorm';
import { AbstractEntity } from 'src/database/abstract.entity';

@Entity('items')
export class Item extends AbstractEntity<Item> {
  @Column()
  name: string;

  @Column({ type: 'int' })
  quantity: number;
}
