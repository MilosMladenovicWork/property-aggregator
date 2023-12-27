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
}

export const PropertySchema = SchemaFactory.createForClass(Property);
