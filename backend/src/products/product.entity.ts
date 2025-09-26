import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'json', nullable: true })
  name_translations: {
    en: string;
    ru: string;
    uk: string;
  };

  @Column({ type: 'text' })
  short_description: string;

  @Column({ type: 'json', nullable: true })
  short_description_translations: {
    en: string;
    ru: string;
    uk: string;
  };

  @Column({ type: 'text' })
  full_description: string;

  @Column({ type: 'json', nullable: true })
  full_description_translations: {
    en: string;
    ru: string;
    uk: string;
  };

  @Column({ type: 'json' })
  description_blocks: Array<{
    title: string;
    content: string;
  }>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', nullable: true })
  category_id: number;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
