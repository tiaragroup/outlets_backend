import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WhyChooseUsFeatureDto } from './create-why-choose-us-section.dto';

export class UpdateWhyChooseUsSectionDto {
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
  @Type(() => Number)
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  translations?: Record<string, Record<string, string>>;

  /**
   * When provided the features list is fully replaced by this payload.
   * Omit the field to keep the existing features untouched.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhyChooseUsFeatureDto)
  features?: WhyChooseUsFeatureDto[];
}
