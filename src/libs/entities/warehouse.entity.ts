import { ExportEntity } from './export.entity';
import { ImportEntity } from './import.entity';
import { ProductEntity } from './product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WarehouseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  stockMaxCapacity: number;

  @Column({ nullable: true })
  stockCurrentCapacity: number;

  @Column()
  hazardous: boolean;

  @OneToMany(() => ProductEntity, (product) => product.warehouse)
  products: ProductEntity[];

  // @OneToMany(() => ImportEntity, (importRecord) => importRecord.warehouse)
  // imports: ImportEntity[];

  // @OneToMany(() => ExportEntity, (exportRecord) => exportRecord.warehouse)
  // exports: ExportEntity[];

  @CreateDateColumn()
  createdAt: number;
}
