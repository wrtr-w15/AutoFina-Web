import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsHexColor, IsObject, ValidateNested } from 'class-validator';
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

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  @IsOptional()
  name_translations?: TranslationDto;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  @IsOptional()
  description_translations?: TranslationDto;

  @IsString()
  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
