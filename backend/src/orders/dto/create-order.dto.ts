import { IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

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
}
