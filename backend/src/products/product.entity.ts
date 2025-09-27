import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'json', nullable: true })
  name_translations: {
    en: string;
    ru: string;
    uk: string;
  };

  @Column({ type: 'text', nullable: true })
  short_description: string;

  @Column({ type: 'json', nullable: true })
  short_description_translations: {
    en: string;
    ru: string;
    uk: string;
  };

  @Column({ type: 'text', nullable: true })
  full_description: string;

  @Column({ type: 'json', nullable: true })
  full_description_translations: {
    en: string;
    ru: string;
    uk: string;
  };

  @Column({ type: 'json', nullable: true })
  description_blocks: Array<{
    title: string;
    content: string;
  }>;

  @Column({ type: 'json', nullable: true })
  description_blocks_translations: {
    en: Array<{
      title: string;
      content: string;
    }>;
    ru: Array<{
      title: string;
      content: string;
    }>;
    uk: Array<{
      title: string;
      content: string;
    }>;
  };

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

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: Category[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
