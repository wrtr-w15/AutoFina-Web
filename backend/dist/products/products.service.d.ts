import { Repository } from 'typeorm';
import { Product } from './product.entity';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(createProductDto: any): Promise<Product>;
    update(id: number, updateProductDto: any): Promise<Product>;
    remove(id: number): Promise<void>;
}
