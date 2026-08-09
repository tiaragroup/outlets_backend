import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class WhyChooseUsFeatureDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  icon?: string | null;

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

export class CreateWhyChooseUsSectionDto {
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
  @Type(() => Number)
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  translations?: Record<string, Record<string, string>>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhyChooseUsFeatureDto)
  features?: WhyChooseUsFeatureDto[];
}
