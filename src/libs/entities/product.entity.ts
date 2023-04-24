import { ExportEntity } from './export.entity';
import { ImportEntity } from './import.entity';
import { WarehouseEntity } from './warehouse.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  productSize: number;

  @Column()
  isHazardous: boolean;

  @Column({ nullable: true })
  warehouseId?: string;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.products)
  warehouse?: WarehouseEntity;

  @OneToMany(() => ImportEntity, (importRecord) => importRecord.product)
  imports: ImportEntity[];

  @OneToMany(() => ExportEntity, (exportRecord) => exportRecord.product)
  exports: ExportEntity[];

  @CreateDateColumn()
  createdAt: number;
}
