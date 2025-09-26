import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  project_name: string;

  @Column({ type: 'text', nullable: true })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  technical_spec: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  timeline: string;

  @Column({ type: 'varchar', length: 100 })
  telegram: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  promo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ 
    type: 'enum', 
    enum: ['personal', 'cart'],
    default: 'personal'
  })
  order_type: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
