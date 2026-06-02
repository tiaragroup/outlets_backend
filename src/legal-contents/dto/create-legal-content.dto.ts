import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { LegalContentType } from '../entities/module-legal-content.entity';

export class CreateLegalContentDto {
  @ValidateIf((o) => !o.moduleSlug)
  @Type(() => Number)
  @IsInt()
  moduleId?: number;

  @ValidateIf((o) => !o.moduleId)
  @IsString()
  moduleSlug?: string;

  @IsEnum(LegalContentType)
  contentType: LegalContentType;

  @IsString()
  slug: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsObject()
  translations: Record<string, Record<string, string>>;
}