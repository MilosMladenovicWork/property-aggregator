import { Controller, Get, Post } from '@nestjs/common';
import { PropertyService } from './services/property.service';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  getHello(): string {
    return this.propertyService.getHello();
  }

  @Post('sync-properties-from-external-providers')
  async syncPropertiesFromExternalProviders(): Promise<string> {
    this.propertyService.syncPropertiesFromExternalProviders();

    return 'Syncing properties';
  }
}
