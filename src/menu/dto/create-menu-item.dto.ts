import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemVariantDto {
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsInt()
  calories?: number;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsObject()
  translations: Record<string, Record<string, string>>;
}

export class CreateMenuItemDto {
  @IsOptional()
  @IsInt()
  moduleId?: number;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsInt()
  sellerPriority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsObject()
  translations: Record<string, Record<string, string>>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemVariantDto)
  variants?: CreateMenuItemVariantDto[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  addonIds?: number[];
}