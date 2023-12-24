import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PropertyService {
  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_MINUTE)
  syncPropertiesFromExternalProviders() {}
}
