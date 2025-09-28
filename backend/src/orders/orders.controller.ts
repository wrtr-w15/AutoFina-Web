import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      console.log('OrdersController: Received data:', JSON.stringify(createOrderDto, null, 2));
      const order = await this.ordersService.create(createOrderDto);
      console.log('OrdersController: Created order:', JSON.stringify(order, null, 2));
      return {
        success: true,
        message: 'Order created successfully',
        data: order
      };
    } catch (error) {
      console.error('OrdersController: Error creating order:', error);
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      const orders = await this.ordersService.findAll();
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    try {
      const order = await this.ordersService.findOne(+id);
      if (!order) {
        return {
          success: false,
          message: 'Order not found'
        };
      }
      return {
        success: true,
        data: order
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch order',
        error: error.message
      };
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    try {
      const order = await this.ordersService.updateStatus(+id, updateOrderStatusDto);
      return {
        success: true,
        message: 'Order status updated successfully',
        data: order
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update order status',
        error: error.message
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.ordersService.remove(+id);
      return {
        success: true,
        message: 'Order deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete order',
        error: error.message
      };
    }
  }
}
