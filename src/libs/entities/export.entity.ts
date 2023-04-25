import { ProductEntity } from './product.entity';
// import { WarehouseEntity } from './warehouse.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ExportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  exportToWarehouseId: string;

  @Column()
  exportDate: Date;

  @ManyToOne(() => ProductEntity, (product) => product.exports)
  product: ProductEntity;

  // @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.imports)
  // warehouse: WarehouseEntity;

  @Column()
  productId: string;

  @CreateDateColumn()
  createdAt: Date;
}
