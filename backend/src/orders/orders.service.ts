import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import axios from 'axios';

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
    
    // Send webhook
    await this.sendWebhook(savedOrder);
    
    return savedOrder;
  }

  private async sendWebhook(order: Order): Promise<void> {
    const webhookUrl = process.env.WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.log('WEBHOOK_URL not configured, skipping webhook');
      return;
    }

    try {
      const webhookData = {
        event: 'order.created',
        timestamp: new Date().toISOString(),
        order: {
          id: order.id,
          name: order.name,
          telegram: order.telegram,
          email: order.email,
          project_name: order.project_name,
          short_description: order.short_description,
          technical_spec: order.technical_spec,
          timeline: order.timeline,
          promo: order.promo,
          message: order.message,
          order_type: order.order_type,
          status: order.status,
          total_price: order.total_price,
          products: order.products,
          created_at: order.created_at
        }
      };

      console.log('Sending webhook to:', webhookUrl);
      console.log('Webhook data:', JSON.stringify(webhookData, null, 2));

      const response = await axios.post(webhookUrl, webhookData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AutoFina-Webhook/1.0'
        },
        timeout: 10000 // 10 seconds timeout
      });

      console.log('Webhook sent successfully:', response.status, response.statusText);
    } catch (error) {
      console.error('Failed to send webhook:', error.message);
      if (error.response) {
        console.error('Webhook response error:', error.response.status, error.response.data);
      }
    }
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
