import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSliderDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  moduleId?: number;

  @IsOptional()
  @IsString()
  moduleSlug?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  mobileImage?: string;

  @IsOptional()
  @IsString()
  buttonUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  translations?: Record<string, Record<string, string>>;
}