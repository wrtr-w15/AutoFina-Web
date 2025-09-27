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
  @IsOptional()
  name?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  @IsOptional()
  name_translations?: TranslationDto;

  @IsString()
  @IsOptional()
  short_description?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  @IsOptional()
  short_description_translations?: TranslationDto;

  @IsString()
  @IsOptional()
  full_description?: string;

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
  @IsOptional()
  description_blocks?: DescriptionBlockDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  @IsOptional()
  description_blocks_translations?: {
    en: DescriptionBlockDto[];
    ru: DescriptionBlockDto[];
    uk: DescriptionBlockDto[];
  };

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  category_ids?: number[];
}
