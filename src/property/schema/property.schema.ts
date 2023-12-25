import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  location: string[];

  @Prop({ required: true })
  url: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
