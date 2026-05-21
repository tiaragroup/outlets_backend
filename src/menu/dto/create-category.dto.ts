import { IsBoolean, IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsInt()
  moduleId: number;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsObject()
  translations: Record<string, Record<string, string>>;
}