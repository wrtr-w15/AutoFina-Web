import { IsString, IsOptional, IsNotEmpty, IsEmail, IsEnum, IsNumber, IsArray, ValidateNested, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsString()
  price: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  project_name: string;

  @IsString()
  @IsOptional()
  short_description?: string;

  @IsString()
  @IsOptional()
  technical_spec?: string;

  @IsString()
  @IsOptional()
  timeline?: string;

  @IsString()
  @IsNotEmpty()
  telegram: string;

  @IsString()
  @IsOptional()
  promo?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsEnum(['personal', 'available'])
  @IsOptional()
  order_type?: string;

      // Поля для checkout заказов
      @IsString()
      @IsOptional()
      name?: string;

  @IsNumber()
  @IsOptional()
  total_price?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsOptional()
  products?: ProductDto[];
}
