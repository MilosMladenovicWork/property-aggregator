import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { launch } from 'puppeteer';
import { PropertyHaloOglasiService } from './property-halo-oglasi.service';

@Injectable()
export class PropertyService {
  syncPropertiesFromExternalProvidersExecuting = false;

  constructor(private propertyHaloOglasiService: PropertyHaloOglasiService) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncPropertiesFromExternalProviders() {
    try {
      if (!this.syncPropertiesFromExternalProvidersExecuting) {
        this.syncPropertiesFromExternalProvidersExecuting = true;

        const browser = await launch({ headless: true });

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
