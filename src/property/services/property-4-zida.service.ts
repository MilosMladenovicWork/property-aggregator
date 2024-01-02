import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import { Property } from '../schema/property.schema';

@Injectable()
export class Property4ZidaService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    //@ts-expect-error ts version problem
    @InjectPage() private readonly page: Page,
  ) {}
}
