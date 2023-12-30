import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PROPERTY_PROVIDERS } from '../types/property-providers.enum';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  location: string[];

  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ required: true })
  provider: PROPERTY_PROVIDERS;

  @Prop({ type: 'string' })
  description?: string | null;

  @Prop({ type: 'string' })
  propertyType?: string | null;

  @Prop({ type: 'number' })
  squareMeters?: number | null;

  @Prop({ type: 'string' })
  numberOfRooms?: string | null;

  @Prop({ default: [] })
  propertyFlags: string[];

  @Prop({ type: 'string' })
  price?: string | null;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
