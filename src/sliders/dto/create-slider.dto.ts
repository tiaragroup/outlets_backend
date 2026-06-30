import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateSliderDto {
  @ValidateIf((o) => !o.moduleSlug)
  @Type(() => Number)
  @IsInt()
  moduleId?: number;

  @ValidateIf((o) => !o.moduleId)
  @IsString()
  moduleSlug?: string;

  @IsString()
  slug: string;

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

  @IsObject()
  translations: Record<string, Record<string, string>>;
}