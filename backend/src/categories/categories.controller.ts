import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('public')
  async findPublic() {
    try {
      const categories = await this.categoriesService.findActive();
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      const categories = await this.categoriesService.findAll();
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoriesService.findOne(+id);
      return {
        success: true,
        data: category
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch category',
        error: error.message
      };
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoriesService.create(createCategoryDto);
      return {
        success: true,
        message: 'Category created successfully',
        data: category
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create category',
        error: error.message
      };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoriesService.update(+id, updateCategoryDto);
      return {
        success: true,
        message: 'Category updated successfully',
        data: category
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update category',
        error: error.message
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.categoriesService.remove(+id);
      return {
        success: true,
        message: 'Category deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete category',
        error: error.message
      };
    }
  }
}
