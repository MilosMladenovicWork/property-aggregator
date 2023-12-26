import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { launch } from 'puppeteer';
import { PropertyHaloOglasiService } from './property-halo-oglasi.service';
import { Property } from './schema/property.schema';

@Injectable()
export class PropertyService {
  syncPropertiesFromExternalProvidersExecuting = false;

  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    private propertyHaloOglasiService: PropertyHaloOglasiService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncPropertiesFromExternalProviders() {
    try {
      if (!this.syncPropertiesFromExternalProvidersExecuting) {
        this.syncPropertiesFromExternalProvidersExecuting = true;

        const browser = await launch({ headless: false });

        await this.propertyHaloOglasiService.getPropertiesFromHaloOglasi({
          browser,
        });

        await browser.close();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.syncPropertiesFromExternalProvidersExecuting = false;
    }
  }
}
