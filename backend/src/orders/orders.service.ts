import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    console.log('OrdersService: Creating order with data:', JSON.stringify(createOrderDto, null, 2));
    const order = this.ordersRepository.create(createOrderDto);
    console.log('OrdersService: Created order entity:', JSON.stringify(order, null, 2));
    const savedOrder = await this.ordersRepository.save(order);
    console.log('OrdersService: Saved order:', JSON.stringify(savedOrder, null, 2));
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Order> {
    return await this.ordersRepository.findOne({ where: { id } });
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    await this.ordersRepository.update(id, { status: updateOrderStatusDto.status });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }
}
