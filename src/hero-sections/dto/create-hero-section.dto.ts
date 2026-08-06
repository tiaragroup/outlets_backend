import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateHeroSectionDto {
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
  backgroundImage?: string | null;

  @IsOptional()
  @IsString()
  mobileBackgroundImage?: string | null;

  @IsOptional()
  @IsString()
  primaryButtonUrl?: string | null;

  @IsOptional()
  @IsString()
  secondaryButtonUrl?: string | null;

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