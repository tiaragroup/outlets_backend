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

export class UpdateMenuItemVariantDto {
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

  @IsOptional()
  @IsObject()
  translations?: Record<string, Record<string, string>>;
}

export class UpdateMenuItemDto {
  @IsOptional()
  @IsInt()
  moduleId?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  slug?: string;

  /**
   * Send image as:
   * - string => update image path
   * - null => remove image path
   * - undefined / missing => keep old image path
   */
  @IsOptional()
  @IsString()
  image?: string | null;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsInt()
  sellerPriority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  translations?: Record<string, Record<string, string>>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMenuItemVariantDto)
  variants?: UpdateMenuItemVariantDto[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  addonIds?: number[];
}