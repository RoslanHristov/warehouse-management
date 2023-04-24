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
export class ImportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  // @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.imports)
  // warehouse: WarehouseEntity;

  @Column()
  warehouseId: string;

  @ManyToOne(() => ProductEntity, (product) => product.imports)
  product: ProductEntity;

  @Column()
  productId: string;

  @Column()
  importDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
