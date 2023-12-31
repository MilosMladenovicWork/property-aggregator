import { IsOptional, IsString, MaxLength } from 'class-validator';
import {
  PROPERTY_SEARCH_LOCATION_MAX_LENGTH,
  PROPERTY_SEARCH_NUMBER_OF_ROOMS_MAX_LENGTH,
  PROPERTY_SEARCH_PRICE_MAX_LENGTH,
  PROPERTY_SEARCH_PROPERTY_FLAGS_MAX_LENGTH,
  PROPERTY_SEARCH_QUERY_MAX_LENGTH,
  PROPERTY_SEARCH_SQUARE_METERS_MAX_LENGTH,
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

  @IsString()
  @MaxLength(PROPERTY_SEARCH_SQUARE_METERS_MAX_LENGTH)
  @IsOptional()
  squareMetersMin?: string | null;

  @IsString()
  @MaxLength(PROPERTY_SEARCH_SQUARE_METERS_MAX_LENGTH)
  @IsOptional()
  squareMetersMax?: string | null;

  @IsString()
  @MaxLength(PROPERTY_SEARCH_PRICE_MAX_LENGTH)
  @IsOptional()
  priceMin?: string | null;

  @IsString()
  @MaxLength(PROPERTY_SEARCH_PRICE_MAX_LENGTH)
  @IsOptional()
  priceMax?: string | null;
}
