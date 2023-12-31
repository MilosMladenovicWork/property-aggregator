import { IsOptional, IsString } from 'class-validator';

export class PropertySearchSearchRequestQuery {
  @IsString()
  @IsOptional()
  query?: string | null;

  @IsString()
  @IsOptional()
  location?: string | null;

  @IsString()
  @IsOptional()
  propertyFlags?: string | null;

  @IsString()
  @IsOptional()
  numberOfRooms?: string | null;

  @IsString()
  @IsOptional()
  squareMetersMin?: string | null;

  @IsString()
  @IsOptional()
  squareMetersMax?: string | null;

  @IsString()
  @IsOptional()
  priceMin?: string | null;

  @IsString()
  @IsOptional()
  priceMax?: string | null;
}
