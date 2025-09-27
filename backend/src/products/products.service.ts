import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      relations: ['categories'],
      order: { created_at: 'DESC' }
    });
  }

  async findActive(): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { is_active: true },
      relations: ['categories'],
      order: { created_at: 'DESC' }
    });
  }

  async findActiveOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ 
      where: { id, is_active: true },
      relations: ['categories']
    });
    if (!product) {
      throw new NotFoundException(`Active product with ID ${id} not found`);
    }
    return product;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ 
      where: { id },
      relations: ['categories']
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    
    // Handle categories if provided
    if (createProductDto.category_ids && createProductDto.category_ids.length > 0) {
      const categories = await this.categoriesRepository.findByIds(createProductDto.category_ids);
      product.categories = categories;
    }
    
    return await this.productsRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
