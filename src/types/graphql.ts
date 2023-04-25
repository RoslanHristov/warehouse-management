
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateExportInput {
    amount: number;
    productId: string;
    exportDate: string;
    exportFromWarehouseId: string;
    exportToWarehouseId: string;
}

export class UpdateExportInput {
    amount?: Nullable<number>;
    productId?: Nullable<string>;
    exportDate?: Nullable<string>;
    exportFromWarehouseId?: Nullable<string>;
    exportToWarehouseId?: Nullable<string>;
}

export class CreateProductInput {
    name: string;
    productSize: number;
    isHazardous: boolean;
    warehouseId: string;
}

export class UpdateProductInput {
    id: string;
    name?: Nullable<string>;
    productSize?: Nullable<number>;
    warehouseId?: Nullable<string>;
}

export class CreateWarehouseInput {
    name: string;
    stockMaxCapacity: number;
    hazardous: boolean;
}

export class UpdateWarehouseInput {
    id: string;
    name?: Nullable<string>;
    stockMaxCapacity?: Nullable<number>;
    hazardous?: Nullable<boolean>;
}

export class Export {
    id: string;
    amount: number;
    productId: string;
    exportDate: string;
    exportFromWarehouseId: string;
    exportToWarehouseId: string;
    createdAt: string;
}

export abstract class IQuery {
    abstract getExports(): Export[] | Promise<Export[]>;

    abstract getExport(id: string): Export | Promise<Export>;

    abstract findAllProducts(): Nullable<Product>[] | Promise<Nullable<Product>[]>;

    abstract findProductById(id: string): Nullable<Product> | Promise<Nullable<Product>>;

    abstract findAllWarehouses(): Nullable<Warehouse>[] | Promise<Nullable<Warehouse>[]>;

    abstract findWarehouseById(id: string): Nullable<Warehouse> | Promise<Nullable<Warehouse>>;

    abstract getWarehouseStockCurrentCapacity(id: string): Nullable<number> | Promise<Nullable<number>>;

    abstract getAllWarehousesCurrentCapacity(): Nullable<number> | Promise<Nullable<number>>;
}

export abstract class IMutation {
    abstract createExport(CreateExportInput: CreateExportInput): Export | Promise<Export>;

    abstract updateExport(id: string, UpdateExportInput: UpdateExportInput): Export | Promise<Export>;

    abstract deleteExport(id: string): boolean | Promise<boolean>;

    abstract createProduct(CreateProductInput: CreateProductInput): Product | Promise<Product>;

    abstract updateProduct(UpdateProductInput: UpdateProductInput): Nullable<Product> | Promise<Nullable<Product>>;

    abstract deleteProduct(id: string): Nullable<string> | Promise<Nullable<string>>;

    abstract createWarehouse(CreateWarehouseInput: CreateWarehouseInput): Warehouse | Promise<Warehouse>;

    abstract updateWarehouse(UpdateWarehouseInput: UpdateWarehouseInput): Warehouse | Promise<Warehouse>;

    abstract deleteWarehouse(id: string): Nullable<string> | Promise<Nullable<string>>;
}

export class Product {
    id: string;
    name: string;
    productSize: number;
    isHazardous: boolean;
    warehouseId: string;
    createdAt: string;
}

export class Warehouse {
    id: string;
    name: string;
    stockMaxCapacity: number;
    stockCurrentCapacity?: Nullable<number>;
    hazardous: boolean;
    products: Nullable<Product>[];
    exports?: Nullable<Nullable<Export>[]>;
    createdAt: string;
}

type Nullable<T> = T | null;
