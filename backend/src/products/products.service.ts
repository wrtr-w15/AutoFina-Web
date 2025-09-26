import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Product> {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async create(createProductDto: any): Promise<Product> {
    const product = new Product();
    Object.assign(product, createProductDto);
    return await this.productsRepository.save(product);
  }

  async update(id: number, updateProductDto: any): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
