import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PropertyHaloOglasiService } from './property-halo-oglasi.service';

@Injectable()
export class PropertyService {
  constructor(private propertyHaloOglasiService: PropertyHaloOglasiService) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async syncPropertiesFromExternalProviders() {
    await this.propertyHaloOglasiService.getPropertiesFromHaloOglasi();
  }
}
