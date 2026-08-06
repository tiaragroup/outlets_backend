import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateGalleryDto {
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
  @Type(() => Number)
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
