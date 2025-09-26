import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('public')
  async findPublic() {
    try {
      const products = await this.productsService.findActive();
      return {
        success: true,
        data: products
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      };
    }
  }

  @Get('public/:id')
  async findPublicOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findActiveOne(+id);
      return {
        success: true,
        data: product
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch product',
        error: error.message
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      const products = await this.productsService.findAll();
      return {
        success: true,
        data: products
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(+id);
      if (!product) {
        return {
          success: false,
          message: 'Product not found'
        };
      }
      return {
        success: true,
        data: product
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch product',
        error: error.message
      };
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productsService.create(createProductDto);
      return {
        success: true,
        message: 'Product created successfully',
        data: product
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create product',
        error: error.message
      };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productsService.update(+id, updateProductDto);
      return {
        success: true,
        message: 'Product updated successfully',
        data: product
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update product',
        error: error.message
      };
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async replace(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productsService.update(+id, updateProductDto);
      return {
        success: true,
        message: 'Product updated successfully',
        data: product
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update product',
        error: error.message
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.productsService.remove(+id);
      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete product',
        error: error.message
      };
    }
  }
}
