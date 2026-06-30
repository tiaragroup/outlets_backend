import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateSocialLinkDto {
  @ValidateIf((o) => !o.moduleSlug)
  @Type(() => Number)
  @IsInt()
  moduleId?: number;

  @ValidateIf((o) => !o.moduleId)
  @IsString()
  moduleSlug?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  translations?: Record<string, Record<string, string>>;
}