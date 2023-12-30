import { IsOptional, IsString } from 'class-validator';

export class PropertySearchSearchRequestQuery {
  @IsString()
  @IsOptional()
  query?: string | null;
}
