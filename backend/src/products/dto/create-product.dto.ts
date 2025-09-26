import { IsString, IsNumber, IsArray, IsNotEmpty, Min, IsOptional, IsBoolean, IsUrl, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ru: string;

  @IsString()
  @IsNotEmpty()
  uk: string;
}

export class DescriptionBlockDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  @IsOptional()
  name_translations?: TranslationDto;

  @IsString()
  @IsNotEmpty()
  short_description: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  @IsOptional()
  short_description_translations?: TranslationDto;

  @IsString()
  @IsNotEmpty()
  full_description: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  @IsOptional()
  full_description_translations?: TranslationDto;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DescriptionBlockDto)
  description_blocks: DescriptionBlockDto[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
