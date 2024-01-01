import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  PROPERTY_SEARCH_LOCATION_MAX_LENGTH,
  PROPERTY_SEARCH_NUMBER_OF_ROOMS_MAX_LENGTH,
  PROPERTY_SEARCH_PRICE_MAX,
  PROPERTY_SEARCH_PRICE_MIN,
  PROPERTY_SEARCH_PROPERTY_FLAGS_MAX_LENGTH,
  PROPERTY_SEARCH_QUERY_MAX_LENGTH,
  PROPERTY_SEARCH_SQUARE_METERS_MAX,
  PROPERTY_SEARCH_SQUARE_METERS_MIN,
} from '../constants/property-search.constant';

export class PropertySearchSearchRequestQuery {
  @IsString()
  @MaxLength(PROPERTY_SEARCH_QUERY_MAX_LENGTH)
  @IsOptional()
  query?: string | null;

  @IsString()
  @MaxLength(PROPERTY_SEARCH_LOCATION_MAX_LENGTH)
  @IsOptional()
  location?: string | null;

  @IsString()
  @MaxLength(PROPERTY_SEARCH_PROPERTY_FLAGS_MAX_LENGTH)
  @IsOptional()
  propertyFlags?: string | null;

  @IsString()
  @MaxLength(PROPERTY_SEARCH_NUMBER_OF_ROOMS_MAX_LENGTH)
  @IsOptional()
  numberOfRooms?: string | null;

  @IsNumber()
  @Type(() => Number)
  @Min(PROPERTY_SEARCH_SQUARE_METERS_MIN)
  @Max(PROPERTY_SEARCH_SQUARE_METERS_MAX)
  @IsOptional()
  squareMetersMin?: number | null;

  @IsNumber()
  @Type(() => Number)
  @Min(PROPERTY_SEARCH_SQUARE_METERS_MIN)
  @Max(PROPERTY_SEARCH_SQUARE_METERS_MAX)
  @IsOptional()
  squareMetersMax?: number | null;

  @IsNumber()
  @Type(() => Number)
  @Min(PROPERTY_SEARCH_PRICE_MIN)
  @Max(PROPERTY_SEARCH_PRICE_MAX)
  @IsOptional()
  priceMin?: number | null;

  @IsNumber()
  @Type(() => Number)
  @Min(PROPERTY_SEARCH_PRICE_MIN)
  @Max(PROPERTY_SEARCH_PRICE_MAX)
  @IsOptional()
  priceMax?: number | null;
}
